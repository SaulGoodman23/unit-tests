import jwt from "jsonwebtoken";
import User from "../models/users.js"

import {isAuthenticatedUser} from "../middlewares/auth.js"

const mockRequest = () => {
    return {
        headers: {
            authorization: "Bearer FAKE_JWT_TOKEN"
        }
    }
}

const mockResponse = () => {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }
}

const mockNext = jest.fn()

const mockUser = {
    _id: "125gjyutrpoaaa12222",
    name: "Nasser",
    email: "Nasser@gmail.com",
    password: "hashedPassword"
}

describe("Authentication Middleware", () => {
    it("Missing Authorization header", async () => {
        const mockReq = {}
        const mockRes = mockResponse()

        await isAuthenticatedUser(mockReq, mockRes, mockNext)

        expect(mockRes.status).toHaveBeenCalledWith(401)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Missing Authorization header with Bearer token"
        })
    })

    it("Token is not found", async () => {
        const mockReq = {
            headers: {
                authorization: "Bearer"
            }
        }
        const mockRes = mockResponse()

        await isAuthenticatedUser(mockReq, mockRes, mockNext)

        expect(mockRes.status).toHaveBeenCalledWith(401)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Token is not found(Authentication Failed)"
        })
    })

    it("Should authenticate the user", async () => {
        jest.spyOn(jwt, 'verify').mockResolvedValueOnce({id: mockUser._id})
        jest.spyOn(User,'findById').mockResolvedValueOnce(mockUser)
        const mockReq = mockRequest()
        const mockRes = mockResponse()

        await isAuthenticatedUser(mockReq, mockRes, mockNext)
        expect(mockReq.user).toEqual(mockUser)
        expect(mockNext).toBeCalledTimes(1)
    })
})

