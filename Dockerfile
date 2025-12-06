# -------------------------
# 1단계: Build with Node
# -------------------------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# -------------------------
# 2단계: Serve with Nginx
# -------------------------
FROM nginx:1.25-alpine

# React 빌드 산출물 복사
COPY --from=builder /app/build /usr/share/nginx/html

# custom nginx conf (SPA 라우팅)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
