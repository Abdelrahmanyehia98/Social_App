enum RoleEnum {
    USER ='user',
    ADMIN ='admin'
}
enum GenderEnum {
    MALE ='male',
    FEMALE ='female',
    OTHER ='other'
}
enum ProviderEnum {
    GOOGLE ='google',
    LOCAL ='local'
}
enum OtpTypesEnum {
    CONFIRMATION = 'confirmation',
    RESET_PASSWORD = 'reset-password'
}

enum FriendShipStatusEnum {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected'
}

enum ConversationEnum {
    DIRECT = 'direct',
    GROUP = 'group'
}
enum ReactOnModelEnum {
    POST = "Post",
    COMMENT = "Comment"
}

enum ReactTypeEnum {
    LIKE = "LIKE",
    LOVE = "LOVE",
    HAHA = "HAHA",
    SAD = "SAD",
    ANGRY = "ANGRY"
}

export {ReactOnModelEnum,ReactTypeEnum,ConversationEnum,FriendShipStatusEnum,RoleEnum,GenderEnum,ProviderEnum,OtpTypesEnum}