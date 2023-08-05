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

    it("Should throw validation error for required fields", async () => {
        const user = new User()
        jest.spyOn(user, 'validate').mockRejectedValueOnce({
            errors: {
                name: 'Please enter your name',
                email: 'Please enter your email address',
                password: 'Please enter password'
            }
        })

        try {
            await user.validate()
        } catch (err) {
            expect(err.errors.name).toBeDefined()
            expect(err.errors.email).toBeDefined()
            expect(err.errors.password).toBeDefined()
        }
    })
})