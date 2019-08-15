export default class Singer {
  id: string
  name: string
  avatar: any
  aliaName?: string
  constructor({ id, name, avatar, aliaName }: {id: string, name: string, avatar: any, aliaName?: string}) {
    this.id = id
    this.name = name
    this.avatar = avatar
    this.aliaName = aliaName
  }
}