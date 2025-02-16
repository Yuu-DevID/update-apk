FROM node:18

# Install PM2 secara global
RUN npm install -g pm2

# Buat direktori kerja
WORKDIR /app

# Salin semua file ke dalam container
COPY . .


# Jalankan aplikasi dengan PM2
CMD ["pm2-runtime", "start", "index.js", "--", "--pairing=6285179840140"]
