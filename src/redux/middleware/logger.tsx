export const logger = (store: any) => (next: any) => (action: any) => {
    console.group(action.type)
    console.log('The action dispatched: ', action)
    const result = next(action)
    console.log('The new state returned: ', store.getState())
    console.groupEnd()
    return result
    }