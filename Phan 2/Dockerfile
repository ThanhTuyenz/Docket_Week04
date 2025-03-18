# Sử dụng base image là node:18
FROM node:18

# Tạo thư mục trong container
WORKDIR /app

# Copy file package.json trước để install trước dependency (tối ưu cache)
COPY package.json .

# Cài dependencies
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Expose port 3000
EXPOSE 3000

# Chạy lệnh khởi động app
CMD ["npm", "start"]
