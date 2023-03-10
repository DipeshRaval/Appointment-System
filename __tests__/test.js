/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
let server;
let agent;

function getCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

async function login(agent, username, password) {
  let res = await agent.get("/login");
  var csrfToken = getCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
}

describe("Test case for database", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(process.env.PORT || 5000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Sign Up", async () => {
    var res = await agent.get("/signup");
    var csrfToken = getCsrfToken(res);
    const response = await agent.post("/users").send({
      firstName: "Dipu",
      lastName: "rvl",
      email: "dipu@gmail.com",
      password: "dipu",
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("sign out", async () => {
    var res = await agent.get("/appointments");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/appointments");
    expect(res.statusCode).toBe(302);
  });

  test("Creates a appointment", async () => {
    var agent = request.agent(server);
    await login(agent, "dipu@gmail.com", "dipu");
    var res = await agent.get("/appointments");
    var csrfToken = getCsrfToken(res);
    const response = await agent.post("/appointments").send({
      appointmentName: "Dhavat Shah",
      dueDate: new Date().toISOString(),
      startTime: "01:11:00",
      endTime: "02:11:00",
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    var agent = request.agent(server);
    await login(agent, "dipu@gmail.com", "dipu");
    var res = await agent.get("/appointments");
    var csrfToken = getCsrfToken(res);
    await agent.post("/appointments").send({
      appointmentName: "Dhavat mehta",
      dueDate: new Date().toISOString(),
      startTime: "03:11:00",
      endTime: "04:11:00",
      _csrf: csrfToken,
    });

    const Appointments = await agent
      .get("/appointments")
      .set("Accept", "application/json");
    const parseAppointments = JSON.parse(Appointments.text);
    const allAppointmentNo = parseAppointments.allAppointment.length;
    const appointment = parseAppointments.allAppointment[allAppointmentNo - 1];
    const appointmentID = appointment.id;

    res = await agent.get("/appointments");
    csrfToken = getCsrfToken(res);

    const rese = await agent
      .delete(`/appointments/${appointmentID}`)
      .send({ _csrf: csrfToken });

    const bool = Boolean(rese.text);
    expect(bool).toBe(true);
  });
});
