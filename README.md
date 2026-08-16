# 쇼핑 리스트 앱

아이템 추가/삭제/체크 기능이 있는 간단한 웹 UI 쇼핑 리스트 앱입니다. 데이터는 [Supabase](https://supabase.com) Postgres 데이터베이스의 `shopping_items` 테이블에 저장됩니다.

## 실행 방법

빌드 도구 없이 정적 파일로만 구성되어 있습니다.

```bash
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000` 에 접속하거나, `index.html` 파일을 직접 열어도 됩니다.

## 데이터베이스 구조

Supabase `shopping_items` 테이블:

| 컴럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | 기본값 `gen_random_uuid()` |
| text | text | 항목 이름 |
| checked | boolean | 완료 여부, 기본값 `false` |
| created_at | timestamptz | 생성 시간, 기본값 `now()` |

Row Level Security가 활성화되어 있으며, 인증 없는 데모 앱 특성상 `anon` 역할에 모든 CRUD(조회/삽입/수정/삭제) 권한을 허용하는 정책이 적용되어 있습니다.

`script.js`의 `SUPABASE_URL`, `SUPABASE_KEY`는 공개(anon/publishable) 키로, RLS 정책에 의해 보호되므로 클라이언트 코드에 포함되는 것이 정상입니다.

## 기능

- 아이템 추가 (Enter 또는 추가 버튼)
- 아이템 체크/언체크 (완료 표시)
- 아이템 개별 삭제
- 완료된 항목 일괄 삭제
- Supabase 기반 데이터 지속 (베믄 별로롐, 새로고침해도 유지)

## 기술 스택

순수 HTML/CSS/JavaScript (프레임워크 미사용) + Supabase (Postgres, Auth-less 공개 백엔드)
