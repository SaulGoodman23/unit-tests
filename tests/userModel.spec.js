import User from "../models/users.js";

afterEach(() => {
    jest.restoreAllMocks()
})

describe("User Model", () => {
    it("Should create a new user", () => {
        const user = new User({
            name: "Nasser",
            email: "nasser@gmail.com",
            password: "12345678"
        })
        expect(user).toHaveProperty("_id")
    })
})