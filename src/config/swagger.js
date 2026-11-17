const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API Documentation",
      version: "1.0.0",
      description: "Dokumentasi API untuk aplikasi Todo dengan operasi CRUD lengkap",
    },
    servers: [
      {
        url: "/",
        description: "Dynamic Server (Otomatis menyesuaikan domain saat ini)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Todo: {
          type: "object",
          required: ["title"],
          properties: {
            id: {
              type: "string",
              description: "ID otomatis dari database",
            },
            title: {
              type: "string",
              description: "Judul kegiatan todo",
            },
            description: {
              type: "string",
              description: "Keterangan detail kegiatan",
            },
            completed: {
              type: "boolean",
              description: "Status penyelesaian tugas",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;