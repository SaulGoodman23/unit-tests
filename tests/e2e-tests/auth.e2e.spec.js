import request from "supertest"
import app from "../../app.js"
import connectDatabase from "../../config/database.js"

beforeAll(async () => {
    await connectDatabase()
})

afterAll(() => {
    // clean the db
})

describe("Auth(e2e)", () => {
    describe("POST-register user", () => {
        it("should throw validation error", async () => {
            const res = await request(app).post("/api/v1/register").send({
                name: "nasser",
                email: "nasser@gmail.com"
            })
            expect(res.statusCode).toBe(400)
            expect(res._body.error).toBe("Please enter all values")
        })

        it("should register the user", async () => {
            const res = await request(app).post("/api/v1/register").send({
                name: "nasser2",
                email: "nasser2@gmail.com",
                password: "8888888"
            })
            expect(res.statusCode).toBe(201)
            expect(res._body.token).toBeDefined()
        })

        it("should throw duplicate email error", async () => {
            const res = await request(app).post("/api/v1/register").send({
                name: "nasser2",
                email: "nasser2@gmail.com",
                password: "8888888"
            })
            expect(res.statusCode).toBe(400)
            expect(res._body.error).toBe("Duplicate email")
        })

    })

    describe("POST-login user", () => {
        it("should throw missing email or password error", async () => {
            const res = await request(app).post("/api/v1/login").send({
                email: "nasser@gmail.com",
            })
            expect(res.statusCode).toBe(400)
            expect(res._body.error).toBe("Please enter email & Password")
        })

        it("invalid email or password", async () => {
            const res = await request(app).post("/api/v1/login").send({
                email: "nasser@gmail.com",
                password: "123333"
            })
            expect(res.statusCode).toBe(400)
            expect(res._body.error).toBe("Invalid Email or Password")
        })

        it("should login user", async () => {
            const res = await request(app).post("/api/v1/login").send({
                email: "nasser2@gmail.com",
                password: "8888888"
            })
            expect(res.statusCode).toBe(200)
            expect(res._body.token).toBeDefined()
        })
    })

    describe("404-> route not found", () => {
        it("should throw route not found error", async () => {
            const res = await request(app).post("/api/v1/todo")
            expect(res.statusCode).toBe(404)
            expect(res._body.error).toBe("Route not found")
        })
    })
})