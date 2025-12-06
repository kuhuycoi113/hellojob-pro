module.exports = {
  apps : [{
    name   : "hellojob-pro",
    script : "npm", // Chạy tiến trình npm
    args: "start", // Chạy script "start" trong package.json
    watch  : false, // Không giám sát file (chỉ giám sát khi phát triển)
    instances: "max", // Chạy số lượng instance bằng số core CPU có sẵn (CLUSTER MODE)
    exec_mode: "cluster", // Kích hoạt chế độ cân bằng tải (Cluster Mode)
    env: {
      NODE_ENV: "production",
      PORT: 9997 // Port mặc định Next.js
    }
  }]
};