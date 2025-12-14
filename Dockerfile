# ----------------------------
# Stage 1: Build Angular App
# ----------------------------
FROM node:18-alpine as build

WORKDIR /app

# Dependencies install
COPY package*.json ./
RUN npm install

# Source code copy aur Build
COPY . .
RUN npm run build --configuration=production

# ----------------------------
# Stage 2: Serve with Nginx
# ----------------------------
FROM nginx:alpine

# Nginx ki default config hatana
RUN rm -rf /usr/share/nginx/html/*

# Stage 1 se 'dist' folder ka content Nginx folder mein copy karna
# NOTE: Angular 17/18/19 mein build path aksar 'dist/frontend/browser' hota hai.
# Agar error aaye toh path check karna padega.
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Custom Nginx config (SPA Routing fix karne ke liye)
# Niche step 4 mein hum yeh file banayenge
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]