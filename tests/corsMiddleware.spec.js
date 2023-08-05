import {cors} from "../middlewares/corsMiddleware.js";

const mockRequest = () => {
    return {
        method: "OPTIONS",
        headers: {
            host: "localhost:3000",
            "access-control-request-method": "GET"
        }
    }
}

const mockResponse = () => {
    const headers = {}
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        set: (key, value) => {
            headers[key] = value
        },
        headers
    }
}

const mockNext = jest.fn()

afterEach(() => {
    jest.restoreAllMocks()
})

describe("Cors Middleware", () => {
    it("Origin is not allowed", async () => {
        const mockReq = {
            headers: {
                host: "localhost:5000",
            }
        }
        const mockRes = mockResponse()

        await cors(mockReq, mockRes, mockNext)
        expect(mockRes.status).toBeCalledWith(403)
        expect(mockRes.json).toBeCalledWith({
            error: "Not Allowed(CORS)"
        })
    })

    it("Origin is allowed", async () => {
        const mockReq = {
            headers: {
                host: "localhost:3000",
            }
        }
        const mockRes = mockResponse()

        await cors(mockReq, mockRes, mockNext)
        expect(mockNext).toBeCalledTimes(1)
    })

    it("preflight request -> handle options method ", async () => {
        const mockReq = mockRequest()
        const mockRes = mockResponse()

        await cors(mockReq, mockRes, mockNext)
        expect(mockRes.status).toBeCalledWith(204)
        expect(mockNext).toBeCalledTimes(1)
    })

    it("preflight request -> handle options method and set headers on response object  ", async () => {
        const expected = {
            'Access-Control-Allow-Origin': 'localhost:3000',
            'Access-Control-Allow-Methods': "GET",
            'Access-Control-Max-Age': '86400',
            "Connection": 'keep-alive'
        }

        const mockReq = mockRequest()
        const mockRes = mockResponse()

        await cors(mockReq, mockRes, mockNext)
        expect(mockRes.headers).toEqual(expected)
    })
})

