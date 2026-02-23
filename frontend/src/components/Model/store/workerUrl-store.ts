

class WorkerUrlStore {
    private static instance: WorkerUrlStore
    
    private _workerUrl: string = ''

    static getInstance() {
        if(!WorkerUrlStore.instance) {
            WorkerUrlStore.instance = new WorkerUrlStore()
        }
        return WorkerUrlStore.instance
    }

    setWorkerUrl(workerUrl: string) {
        this._workerUrl = workerUrl
    }

    getWorkerUrl(): string {
        return this._workerUrl
    }
}

export const workerUrlStore = WorkerUrlStore.getInstance()