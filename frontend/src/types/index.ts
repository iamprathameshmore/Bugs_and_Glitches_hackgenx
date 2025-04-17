export interface IDevice{
    _id:string,
    name:string
    status: string

}

export interface IReading{
    temperature: string
    humidity: string
    airQuality: string
    timestamp:  string
}