# Chọn một image Node.js để làm base
FROM node:18

# Tạo thư mục app
WORKDIR /app

# Sao chép file package.json và package-lock.json
COPY . /app

# Cài đặt các dependencies
RUN npm install


# Mở cổng 3000 cho ứng dụng
EXPOSE 3000

# Chạy ứng dụng khi Docker container được khởi động
CMD npm run dev