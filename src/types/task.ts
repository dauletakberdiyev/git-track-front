export type Task = {
    id: number,
    key: string,
    decription?: string,
    title: string,
    taskStatus: {
        id: number,
        title: string,
    },
    user: {
        id: number,
        name: string,
    }
}

export type createTask = {
    title: string,
    description?: string,
    status: number,
    userId: number,
    repositoryId: number,
}

export type updateTask = {
    id: number,
    title: string,
    description: string,
    status: number,
    userId: number,
}