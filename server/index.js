const pool = require("./db");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// ===== ROUTES =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Realtor API running");
});

// DB 연결 테스트
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("DB 연결 테스트 성공");
    
    // property 테이블 존재 여부 확인
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'property'
      );
    `);
    
    console.log("property 테이블 존재 여부:", tableCheck.rows[0].exists);
    
    res.json({
      now: result.rows[0].now,
      propertyTableExists: tableCheck.rows[0].exists
    });
  } catch (err) {
    console.error("DB 테스트 에러:", err);
    res.status(500).json({ error: "DB connection failed", details: err.message });
  }
});

app.post("/properties", async (req, res) => {
  console.log("=== POST /properties 요청 받음 ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  
  const {
    realtor_id,
    type,
    category, // category 추가
    price,
    area,
    rooms,
    bathrooms,
    sido,
    sigungu,
    dong,
    address,
    lat,
    lng,
    description,
    deal_type,
    maintenance_fee,
    direction,
    floor_info,
    usage_type,
    parking,
    elevator,
    move_in_date,
  } = req.body;

  // deposit과 monthly_rent는 별도로 선언 (재할당 가능하도록)
  let { deposit, monthly_rent } = req.body;

  console.log("Extracted values:", {
    realtor_id, type, category, price, address, deal_type
  });

  // 필수값 검증 - price는 월세의 경우 0일 수 있으므로 null/undefined만 체크
  if (!realtor_id || !type || !address || !deal_type) {
    console.log("필수값 누락 - realtor_id:", realtor_id, "type:", type, "address:", address, "deal_type:", deal_type);
    return res.status(400).json({ error: "필수 값 누락 (realtor_id, type, address, deal_type)" });
  }

  // category 자동 매핑 (category가 없으면 type에 따라 자동 설정)
  let finalCategory = category;
  if (!finalCategory) {
    if (['아파트', '오피스텔', '원룸', '투룸', '빌라'].includes(type)) {
      finalCategory = 'RESIDENTIAL';
    } else if (['상가', '사무실'].includes(type)) {
      finalCategory = 'COMMERCIAL';
    } else if (['공장', '창고'].includes(type)) {
      finalCategory = 'INDUSTRIAL';
    } else if (type === '토지') {
      finalCategory = 'LAND';
    } else {
      return res.status(400).json({ error: `알 수 없는 매물 종류: ${type}` });
    }
    console.log(`category 자동 매핑: ${type} → ${finalCategory}`);
  }

  // 도메인 규칙 검증 (책임 분리 - 서버에서 비즈니스 로직 검증)
  if (deal_type === "매매") {
    // 매매: price 필수, deposit과 monthly_rent는 NULL이어야 함
    if (!price || price <= 0) {
      return res.status(400).json({ error: "매매: 매매가(price)는 필수입니다" });
    }
    if (deposit !== null || monthly_rent !== null) {
      console.log("매매 도메인 규칙 위반 - deposit/monthly_rent를 NULL로 설정");
      // 자동으로 NULL로 설정 (관대한 처리)
      deposit = null;
      monthly_rent = null;
    }
  } else if (deal_type === "전세") {
    // 전세: price 필수, monthly_rent는 NULL이어야 함
    if (!price || price <= 0) {
      return res.status(400).json({ error: "전세: 전세금(price)은 필수입니다" });
    }
    if (monthly_rent !== null) {
      console.log("전세 도메인 규칙 위반 - monthly_rent를 NULL로 설정");
      monthly_rent = null;
    }
  } else if (deal_type === "월세") {
    // 월세: deposit과 monthly_rent 필수, price는 NULL이어야 함
    if (!deposit || deposit < 0 || !monthly_rent || monthly_rent <= 0) {
      return res.status(400).json({ error: "월세: 보증금(deposit)과 월세(monthly_rent)는 필수입니다" });
    }
    if (price !== null && price !== 0) {
      console.log("월세 도메인 규칙 위반 - price를 NULL로 설정");
      price = null;
    }
  }

  try {
    console.log("SQL 실행 전 - values:", [
      realtor_id, type, finalCategory, price, deposit, monthly_rent, area, rooms, bathrooms,
      sido, sigungu, dong, address, lat, lng, description, deal_type, 
      maintenance_fee, direction, floor_info, usage_type, parking, elevator, move_in_date
    ]);
    
    const result = await pool.query(
      `
      INSERT INTO property
      (realtor_id, type, category, price, deposit, monthly_rent, area, rooms, bathrooms,
       sido, sigungu, dong, address, lat, lng, description, deal_type,
       maintenance_fee, direction, floor_info, usage_type, parking, elevator, move_in_date)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
      RETURNING *
      `,
      [
        realtor_id,
        type,
        finalCategory, // category 추가
        price,
        deposit,
        monthly_rent,
        area,
        rooms,
        bathrooms,
        sido,
        sigungu,
        dong,
        address,
        lat,
        lng,
        description,
        deal_type,
        maintenance_fee,
        direction,
        floor_info,
        usage_type,
        parking,
        elevator,
        move_in_date,
      ]
    );

    console.log("SQL 실행 성공:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("SQL 실행 에러:", err);
    console.error("에러 스택:", err.stack);
    res.status(500).json({ error: "매물 등록 실패" });
  }
});

// 추천매물 조회 (메인 페이지용) - 구체적인 경로를 먼저 정의
app.get("/properties/featured", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        (SELECT pi.image_url 
         FROM property_image pi 
         WHERE pi.property_id = p.id AND pi.is_main = true 
         LIMIT 1) AS main_image
      FROM property p
      WHERE p.is_featured = true AND p.status = '거래중'
      ORDER BY p.created_at DESC
      LIMIT 6
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("추천매물 조회 에러:", err);
    res.status(500).json({ error: "추천매물 조회 실패" });
  }
});

// 카테고리별 매물 조회 (메인 페이지용)
app.get("/properties/category/:category", async (req, res) => {
  const { category } = req.params;
  const { limit } = req.query; // limit 쿼리 파라미터 추가
  
  try {
    let query = `
      SELECT 
        p.*,
        (SELECT pi.image_url 
         FROM property_image pi 
         WHERE pi.property_id = p.id AND pi.is_main = true 
         LIMIT 1) AS main_image
      FROM property p
      WHERE p.category = $1 AND p.status = '거래중'
      ORDER BY p.created_at DESC
    `;
    
    const params = [category];
    
    // limit이 제공된 경우에만 LIMIT 추가
    if (limit) {
      query += ` LIMIT $2`;
      params.push(parseInt(limit));
    }
    // limit이 없으면 전체 반환 (매물 더보기 페이지용)

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("카테고리별 매물 조회 에러:", err);
    res.status(500).json({ error: "카테고리별 매물 조회 실패" });
  }
});

// 매물 조회 
app.get("/properties", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        (SELECT pi.image_url 
         FROM property_image pi 
         WHERE pi.property_id = p.id AND pi.is_main = true 
         LIMIT 1) AS main_image
      FROM property p
      ORDER BY p.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("매물 조회 에러:", err);
    res.status(500).json({ error: "매물 조회 실패" });
  }
});

// 특정 매물 이미지 조회
app.get("/properties/:id/images", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT id, image_url, is_main
      FROM property_image
      WHERE property_id = $1
      ORDER BY is_main DESC, id ASC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "이미지 조회 실패" });
  }
});



// 매물 수정
app.put("/properties/:id", async (req, res) => {
  console.log("=== PUT /properties/:id 요청 받음 ===");
  console.log("매물 ID:", req.params.id);
  console.log("요청 body:", req.body);
  
  const { id } = req.params;

  const {
    type,
    category, // category 추가
    price,
    deposit,
    monthly_rent,
    area,
    rooms,
    bathrooms,
    sido,
    sigungu,
    dong,
    address,
    lat,
    lng,
    description,
    status,
    deal_type,
    maintenance_fee,
    direction,
    floor_info,
    usage_type,
    parking,
    elevator,
    move_in_date,
  } = req.body;

  // category 자동 매핑 (category가 없으면 type에 따라 자동 설정)
  let finalCategory = category;
  if (type && !finalCategory) {
    if (['아파트', '오피스텔', '원룸', '투룸', '빌라'].includes(type)) {
      finalCategory = 'RESIDENTIAL';
    } else if (['상가', '사무실'].includes(type)) {
      finalCategory = 'COMMERCIAL';
    } else if (['공장', '창고'].includes(type)) {
      finalCategory = 'INDUSTRIAL';
    } else if (type === '토지') {
      finalCategory = 'LAND';
    }
    console.log(`PUT - category 자동 매핑: ${type} → ${finalCategory}`);
  }

  // 도메인 규칙 검증 (거래유형이 변경되는 경우에만)
  if (deal_type) {
    let updatedPrice = price;
    let updatedDeposit = deposit;
    let updatedMonthlyRent = monthly_rent;
    
    if (deal_type === "매매") {
      // 매매: price 필수, deposit과 monthly_rent는 NULL이어야 함
      if (price !== undefined && (!price || price <= 0)) {
        return res.status(400).json({ error: "매매: 매매가(price)는 필수입니다" });
      }
      // 도메인 규칙 강제 적용
      updatedDeposit = null;
      updatedMonthlyRent = null;
      console.log("매매 도메인 규칙 적용 - deposit/monthly_rent NULL로 설정");
    } else if (deal_type === "전세") {
      // 전세: price 필수, monthly_rent는 NULL이어야 함
      if (price !== undefined && (!price || price <= 0)) {
        return res.status(400).json({ error: "전세: 전세금(price)은 필수입니다" });
      }
      // 도메인 규칙 강제 적용
      updatedMonthlyRent = null;
      console.log("전세 도메인 규칙 적용 - monthly_rent NULL로 설정");
    } else if (deal_type === "월세") {
      // 월세: deposit과 monthly_rent 필수, price는 NULL이어야 함
      if (deposit !== undefined && (!deposit || deposit < 0)) {
        return res.status(400).json({ error: "월세: 보증금(deposit)은 필수입니다" });
      }
      if (monthly_rent !== undefined && (!monthly_rent || monthly_rent <= 0)) {
        return res.status(400).json({ error: "월세: 월세(monthly_rent)는 필수입니다" });
      }
      // 도메인 규칙 강제 적용
      updatedPrice = null;
      console.log("월세 도메인 규칙 적용 - price NULL로 설정");
    }
    
    // 검증된 값으로 override
    req.body.price = updatedPrice;
    req.body.deposit = updatedDeposit;
    req.body.monthly_rent = updatedMonthlyRent;
  }

  try {
    console.log("매물 존재 여부 확인 중...");
    // 존재 여부 확인
    const exists = await pool.query(
      "SELECT id FROM property WHERE id = $1",
      [id]
    );

    if (exists.rows.length === 0) {
      console.log("매물이 존재하지 않음:", id);
      return res.status(404).json({ error: "매물 없음" });
    }

    console.log("매물 존재 확인됨, 업데이트 필드 구성 중...");
    // 동적 업데이트 (보낸 값만 수정)
    const fields = [];
    const values = [];
    let idx = 1;

    const addField = (key, value) => {
      if (value !== undefined && value !== null) {
        fields.push(`${key} = $${idx++}`);
        values.push(value);
        console.log(`필드 추가: ${key} = ${value}`);
      }
    };

    addField("type", type);
    addField("category", finalCategory); // category 추가
    addField("price", price);
    addField("deposit", deposit);
    addField("monthly_rent", monthly_rent);
    addField("area", area);
    addField("rooms", rooms);
    addField("bathrooms", bathrooms);
    addField("address", address);
    addField("description", description);
    addField("deal_type", deal_type);
    addField("maintenance_fee", maintenance_fee);
    addField("direction", direction);
    addField("floor_info", floor_info);
    addField("usage_type", usage_type);
    addField("parking", parking);
    addField("elevator", elevator);
    addField("move_in_date", move_in_date);

    // 선택적 필드들 (프론트에서 보내지 않을 수 있음)
    if (sido !== undefined) addField("sido", sido);
    if (sigungu !== undefined) addField("sigungu", sigungu);
    if (dong !== undefined) addField("dong", dong);
    if (lat !== undefined) addField("lat", lat);
    if (lng !== undefined) addField("lng", lng);
    if (status !== undefined) addField("status", status);

    if (fields.length === 0) {
      console.log("수정할 필드가 없음");
      return res.status(400).json({ error: "수정할 값 없음" });
    }

    const query = `
      UPDATE property
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING *
    `;

    values.push(id);

    console.log("실행할 SQL 쿼리:", query);
    console.log("SQL 매개변수:", values);

    const result = await pool.query(query, values);
    console.log("SQL 실행 성공:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("=== 매물 수정 에러 ===");
    console.error("에러 메시지:", err.message);
    console.error("에러 코드:", err.code);
    console.error("에러 스택:", err.stack);
    console.error("에러 세부사항:", err.detail);
    res.status(500).json({ error: "매물 수정 실패", details: err.message });
  }
});

// 매물 삭제 (단건 조회보다 먼저 정의해야 함)
app.delete("/properties/:id", async (req, res) => {
  console.log("=== DELETE /properties/:id 요청 받음 ===");
  console.log("매물 ID:", req.params.id);
  
  const { id } = req.params;

  try {
    // 매물 존재 여부 확인
    const propertyResult = await pool.query(
      "SELECT id FROM property WHERE id = $1",
      [id]
    );

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ error: "매물을 찾을 수 없음" });
    }

    // 매물에 연결된 이미지들 조회
    const imagesResult = await pool.query(
      "SELECT image_url FROM property_image WHERE property_id = $1",
      [id]
    );

    // 파일 시스템에서 이미지 파일들 삭제
    for (const image of imagesResult.rows) {
      try {
        const filePath = path.join(__dirname, image.image_url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("파일 삭제 완료:", filePath);
        }
      } catch (fileError) {
        console.error("파일 삭제 실패:", fileError);
      }
    }

    // 데이터베이스에서 이미지들 삭제 (외래키 때문에 먼저 삭제)
    await pool.query(
      "DELETE FROM property_image WHERE property_id = $1",
      [id]
    );

    // 매물 삭제
    await pool.query(
      "DELETE FROM property WHERE id = $1",
      [id]
    );

    res.json({ message: "매물 삭제 완료" });
  } catch (err) {
    console.error("매물 삭제 에러:", err);
    res.status(500).json({ error: "매물 삭제 실패" });
  }
});

// 추천매물 설정/해제
app.patch("/properties/:id/featured", async (req, res) => {
  const { id } = req.params;
  const { is_featured } = req.body;

  try {
    // 추천매물로 설정하려는 경우, 현재 추천매물 개수 확인
    if (is_featured) {
      const featuredCount = await pool.query(
        "SELECT COUNT(*) as count FROM property WHERE is_featured = true"
      );
      
      if (parseInt(featuredCount.rows[0].count) >= 8) {
        return res.status(400).json({ 
          error: "추천매물은 최대 8개까지만 설정할 수 있습니다." 
        });
      }
    }

    const result = await pool.query(
      `
      UPDATE property
      SET is_featured = $1
      WHERE id = $2
      RETURNING *
      `,
      [is_featured, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "매물 없음" });
    }

    res.json({ message: is_featured ? "추천매물로 설정 완료" : "추천매물 해제 완료" });
  } catch (err) {
    console.error("추천매물 설정 에러:", err);
    res.status(500).json({ error: "추천매물 설정 실패" });
  }
});

// 매물 상태 변경 (거래중, 거래완료)
app.patch("/properties/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // 허용 상태만
  if (!["거래중", "거래완료"].includes(status)) {
    return res.status(400).json({ error: "잘못된 상태 값" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE property
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "매물 없음" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "상태 변경 실패" });
  }
});
const upload = require("./upload");


// 매물 이미지 업로드
app.post(
  "/properties/:id/images",
  upload.array("images", 5),
  async (req, res) => {
    const { id } = req.params;

    try {
      const files = req.files;

      for (let i = 0; i < files.length; i++) {
        await pool.query(
          `
          INSERT INTO property_image (property_id, image_url, is_main)
          VALUES ($1, $2, $3)
          `,
          [
            id,
            `/uploads/${files[i].filename}`,
            i === 0, // 첫 번째 이미지를 대표로
          ]
        );
      }

      res.json({ message: "이미지 업로드 완료" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "이미지 업로드 실패" });
    }
  }
);

// 매물 이미지 삭제
app.delete("/properties/:propertyId/images/:imageId", async (req, res) => {
  const { propertyId, imageId } = req.params;

  try {
    // 삭제할 이미지 정보 조회
    const imageResult = await pool.query(
      `
      SELECT image_url 
      FROM property_image 
      WHERE id = $1 AND property_id = $2
      `,
      [imageId, propertyId]
    );

    if (imageResult.rows.length === 0) {
      return res.status(404).json({ error: "이미지를 찾을 수 없음" });
    }

    const imageUrl = imageResult.rows[0].image_url;

    // 데이터베이스에서 이미지 삭제
    await pool.query(
      `
      DELETE FROM property_image 
      WHERE id = $1 AND property_id = $2
      `,
      [imageId, propertyId]
    );

    // 파일 시스템에서 실제 이미지 파일 삭제
    try {
      const filePath = path.join(__dirname, imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("파일 삭제 완료:", filePath);
      }
    } catch (fileError) {
      console.error("파일 삭제 실패:", fileError);
      // 파일 삭제 실패해도 DB에서는 삭제되었으므로 계속 진행
    }

    res.json({ message: "이미지 삭제 완료" });
  } catch (err) {
    console.error("이미지 삭제 에러:", err);
    res.status(500).json({ error: "이미지 삭제 실패" });
  }
});

// 대표 이미지 설정
app.patch("/properties/:propertyId/images/:imageId/main", async (req, res) => {
  const { propertyId, imageId } = req.params;

  try {
    // 해당 매물의 모든 이미지를 대표가 아니게 설정
    await pool.query(
      `
      UPDATE property_image 
      SET is_main = false 
      WHERE property_id = $1
      `,
      [propertyId]
    );

    // 선택한 이미지를 대표 이미지로 설정
    const result = await pool.query(
      `
      UPDATE property_image 
      SET is_main = true 
      WHERE id = $1 AND property_id = $2
      RETURNING *
      `,
      [imageId, propertyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "이미지를 찾을 수 없음" });
    }

    res.json({ message: "대표 이미지 설정 완료" });
  } catch (err) {
    console.error("대표 이미지 설정 에러:", err);
    res.status(500).json({ error: "대표 이미지 설정 실패" });
  }
});


// 매물 단건 조회 (상세 페이지용) - 맨 마지막에 위치
app.get("/properties/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        p.*,
        (SELECT pi.image_url 
         FROM property_image pi 
         WHERE pi.property_id = p.id AND pi.is_main = true 
         LIMIT 1) AS main_image
      FROM property p
      WHERE p.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "매물 없음" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "매물 조회 실패" });
  }
});

// ===== SERVER START (항상 맨 마지막) =====
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
