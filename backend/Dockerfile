FROM node:18-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    cmake \
    make \
    ca-certificates \
    g++ \
    ninja-build \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /git_repo

RUN git clone --depth 1 https://github.com/aous72/OpenJPH.git && \
    cd OpenJPH/build && \
    cmake .. && make install && \
    cd ../.. && rm -rf OpenJPH \
    && cp /usr/local/lib/libopenjph.so.0.21 /usr/lib/ && cp /usr/local/lib/libopenjph.so /usr/lib/ \
    && ldconfig

WORKDIR /

COPY . .

RUN npm install &&  npm run build && npm cache clean --force
EXPOSE 8000
CMD ["npm", "run", "start"]