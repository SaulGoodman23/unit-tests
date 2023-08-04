import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {registerUser, loginUser} from "../controllers/authController.js";
import User from "../models/users.js"

// jest.mock("../utils/helpers", () => {
//     getJwtToken:jest.fn(() => "fake_jwt_token")
// });

const mockRequest = () => {
    return {
        body: {
            name: "Nasser",
            email: "Nasser@gmail.com",
            password: "12345678"
        }
    }
}

const mockResponse = () => {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }
}

const mockUser = {
    _id: "125gjyutrpoaaa12222",
    name: "Nasser",
    email: "Nasser@gmail.com",
    password: "hashedPassword"
}

afterEach(() => {
    jest.restoreAllMocks()
})

describe("Register User", () => {
    it("Should register user", async () => {
        jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword")
        jest.spyOn(User, "create").mockResolvedValueOnce(mockUser)
        jest.spyOn(jwt, "sign").mockResolvedValueOnce("Fake_JWT_Token")

        const mockReq = mockRequest()
        const mockRes = mockResponse()

        await registerUser(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(201)
        expect(bcrypt.hash).toHaveBeenCalledWith(mockReq.body.password, 10)
        expect(User.create).toHaveBeenCalledWith({
            name: "Nasser",
            email: "Nasser@gmail.com",
            password: "hashedPassword"
        })
    })

    it("Should throw validation error", async () => {
        const mockReq = mockRequest().body = {body: {}}
        const mockRes = mockResponse()

        await registerUser(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Please enter all values"
        })
    })

    it("Should throw duplicate email error", async () => {
        jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword")
        jest.spyOn(User, "create").mockRejectedValueOnce({code: 11000})

        const mockReq = mockRequest()
        const mockRes = mockResponse()

        await registerUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Duplicate email"
        })
    })
})

describe("Login User", () => {
    it("Should throw missing email or password", async () => {
        const mockReq = mockRequest().body = {body: {}}
        const mockRes = mockResponse()

        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Please enter email & Password"
        })
    })

    it("Should throw user with this email not found", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(null)

        const mockReq = {
            body: {
                email: "Nasser@gmail.com",
                password: "12345678"
            }
        }
        const mockRes = mockResponse()

        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(404)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "User with this email or password not found"
        })
    })

    it("Invalid email or password",async ()=>{
        jest.spyOn(User, "findOne").mockResolvedValueOnce(mockUser)
        jest.spyOn(bcrypt,"compare").mockResolvedValueOnce(false)

        const mockReq = {
            body: {
                email: "Nasser@gmail.com",
                password: "12345678"
            }
        }
        const mockRes = mockResponse()

        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Invalid Email or Password"
        })
    })

    it("Successful login",async ()=>{
        jest.spyOn(User, "findOne").mockResolvedValueOnce(mockUser)
        jest.spyOn(bcrypt,"compare").mockResolvedValueOnce(true)
        jest.spyOn(jwt, "sign").mockResolvedValueOnce("Fake_JWT_Token")


        const mockReq = {
            body: {
                email: "Nasser@gmail.com",
                password: "12345678"
            }
        }
        const mockRes = mockResponse()

        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
            token: "Fake_JWT_Token"
        })
    })
})