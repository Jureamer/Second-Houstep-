# Install

```bash
yarn install
```

# Start

```bash
yarn start
```

# DB Diagram

<img width="501" alt="image" src="https://github.com/Jureamer/Second-Houstep-/assets/91880235/aa666ded-c0a2-4467-9650-334e5ec295a0">

# DDL

```sql
CREATE TABLE `customer` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `grade` char
);

CREATE TABLE `order` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `customer_id` int,
  `order_date` date,
  `order_type` int,
  `order_amount` int
);

ALTER TABLE `order` ADD FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`);
```

# API

```bash
# 고객정보 및 주문내역정보 업로드 API
1. POST /upload
form-data: file

# 월별 매출 통계 조회 API

# 주문 목록 조회 API
```
