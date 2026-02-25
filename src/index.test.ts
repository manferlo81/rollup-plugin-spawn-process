import * as index from "./index"
// @ponicode
describe("index.spawnProcess", () => {
    test("0", () => {
        let callFunction: any = () => {
            index.spawnProcess(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
