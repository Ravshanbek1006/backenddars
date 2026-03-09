# MongoDB Users CRUD

## Setup

1. Install:
   - `npm i`
2. Env:
   - copy `.env.example` → `.env`
   - set your `MONGO_URI`
3. Run:
   - `npm run dev`

## Endpoints

- `POST /api/users` → Create (Model.create)
- `GET /api/users` → Read all (Model.find)
- `GET /api/users/:id` → Read one (Model.findById)
- `PUT /api/users/:id` → Update (Model.findByIdAndUpdate)
- `DELETE /api/users/:id` → Delete (Model.findByIdAndDelete)

### Category

- `POST /categories` → category yaratish
- `GET /categories` → category list

### Product

- `POST /products` → product yaratish (`body`da `categoryId` bo‘lsin)
- `GET /products` → hamma product + `populate("category")`
- `GET /categories/:id/products` → faqat shu category’ga tegishli productlar

## User schema (minimum)

- `fullName`: String (required, min 3)
- `email`: String (required, unique, email format)
- `age`: Number (optional, min 6)
- `role`: String (default: `"student"`)
- `createdAt`: Date (default: `Date.now`)
