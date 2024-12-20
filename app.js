const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
const nunjucks = require("nunjucks");
const cors = require("cors");
const cron = require("node-cron");
dotenv.config();
const registerRoutes = require("./middlewares/register");
const adminRouter = require("./routes/api/admin/exhibitions");
const exhibitionRouter = require("./routes/api/exhibitions");
const authRouter = require("./routes/api/auth");
const venueRouter = require("./routes/api/venues");
const { sequelize } = require("./models");
const { fetchAndSaveExhibitions } = require("./config/cron");

const app = express();
const PORT = process.env.PORT || 3001;

// 매일 자정에 데이터 동기화 작업 실행
cron.schedule("0 0 * * *", fetchAndSaveExhibitions);

// 세션 설정
app.use(
  session({
    secret: "kimt919",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

const { swaggerUi, specs } = require("./swagger/swagger");
const { authorize } = require("./lib/authorization");
const { verifyToken } = require("./lib/authentication");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// 정적 파일 및 뷰 엔진 설정
app.set("view engine", "ejs");
app.set("views", "./views");

// 전역 변수 설정
app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://tools-experts2024-front.vercel.app/",
    ],
  })
);

// 라우트 등록
app.use("/api/auth", authRouter);
app.use("/api/admin/exhibitions", verifyToken, authorize, adminRouter);
app.use("/api/exhibitions", exhibitionRouter);
app.use("/api/venues", venueRouter);
// app.use((req, res, next) => {
//   res.locals.id = "";
//   res.locals.password = "";
//   res.locals.name = "";
//   res.locals.user_name = "";
//   res.locals.phone = "";
//   res.locals.email = "";
//   res.locals.is_admin = "0";

//   if (req.session.user) {
//     res.locals.id = req.session.user.id;
//     res.locals.password = req.session.user.password;
//     res.locals.name = req.session.user.name;
//     res.locals.user_name = req.session.user.user_name;
//     res.locals.phone = req.session.user.phone;
//     res.locals.email = req.session.user.email;
//     res.locals.is_admin = req.session.user.is_admin;
//   }
//   next();
// });
// app.use("/middlewares/register", registerRoutes); // 회원가입

// Sequelize 연결

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error("데이터베이스 연결 실패:", err);
  });

// 페이지 라우트
app.get("/", (req, res) => res.render("index"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.send(
      '<script>alert("로그인 후 이용 가능"); location.href="/login";</script>'
    );
  }
  res.render("profile");

  sequelize
    .sync({ force: false })
    .then(() => {
      console.log("데이터베이스 연결 성공");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((err, req, res, next) => {
  app.get("/find_my_id", (req, res) => res.render("find_my_id"));
  app.get("/register", (req, res) => res.render("register"));
  app.get("/profile", (req, res) => {
    if (!req.session.user) {
      return res.send(
        '<script>alert("로그인 후 이용 가능"); location.href="/login";</script>'
      );
    }
    res.render("profile");
  });
});

// 오류 처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
