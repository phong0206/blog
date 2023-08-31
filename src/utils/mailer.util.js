const nodemailer = require("nodemailer");
const config = require("../config/config");
const handlebars = require("nodemailer-express-handlebars");
const path = require("path");

const host = "smtp.gmail.com";
const port = 465;
const service = "gmail";

const transporter = nodemailer.createTransport({
  service,
  host,
  port,
  secure: true,
  auth: {
    user: config.NODEMAILER_EMAIL,
    pass: config.NODEMAILER_PASS,
  },
});

const viewsPath = path.resolve(__dirname, "../views");
transporter.use(
  "compile",
  handlebars({
    viewEngine: {
      extname: ".html",
      layoutsDir: path.join(viewsPath, "layouts"),
      defaultLayout: false,
      partialsDir: path.join(viewsPath, "partials"),
    },
    viewPath: viewsPath,
    extName: ".html",
  })
);

exports.sendMail = async (to, subject, template, context) => {
  const mailOptions = {
    from: config.NODEMAILER_EMAIL,
    to,
    subject,
    template,
    context,
  };
  await transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log("Message sent successfully!");
  });
};

exports.VerifyMail = async (to, subject, template, context) => {
  const mailOptions = {
    from: config.NODEMAILER_EMAIL,
    to,
    subject,
    template,
    context,
  };
  await transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log("Message sent successfully!");
  });
};
