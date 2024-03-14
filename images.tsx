export const avatarImages = {
    avatar1: {
        name: 'avatar1',
        uri: require('./assets/avatar1.png')
    },
    avatar2: {
        name: 'avatar2',
        uri: require('./assets/avatar2.png')
    },
    avatar3: {
        name: 'avatar3',
        uri: require('./assets/avatar3.png')
    },
    avatar4: {
        name: 'avatar4',
        uri: require('./assets/avatar4.png')
    },
    avatar5: {
        name: 'avatar5',
        uri: require('./assets/avatar5.png')
    },
    avatar6: {
        name: 'avatar6',
        uri: require('./assets/avatar6.png')
    },
    avatar7: {
        name: 'avatar7',
        uri: require('./assets/avatar7.png')
    },
    avatar8: {
        name: 'avatar8',
        uri: require('./assets/avatar8.png')
    },
    avatar9: {
        name: 'avatar9',
        uri: require('./assets/avatar9.png')
    },
}

export const getAvatar = (id: string) => {
    switch(id) {
        case "1":
            return require('./assets/avatar1.png');
        case "2":
            return require('./assets/avatar2.png');
        case "3":
            return require('./assets/avatar3.png');
        case "4":
            return require('./assets/avatar4.png');
        case "5":
            return require('./assets/avatar5.png');
        case "6":
            return require('./assets/avatar6.png');
        case "7":
            return require('./assets/avatar7.png');
        case "8":
            return require('./assets/avatar8.png');
        case "9":
            return require('./assets/avatar9.png');

        default:
            return require('./assets/avatar1.png');
    }
}

export const getBadges = (id: string) => {
    switch(id) {
        case "1":
            return require('./assets/badgePerso/badgePerso1.png');
        case "2":
            return require('./assets/badgePerso/badgePerso2.png');
        case "3":
            return require('./assets/badgePerso/badgePerso3.png');
        case "4":
            return require('./assets/badgePerso/badgePerso4.png');
        case "5":
            return require('./assets/badgePerso/badgePerso5.png');
        case "6":
            return require('./assets/badgePerso/badgePerso6.png');
        case "7":
            return require('./assets/badgePerso/badgePerso7.png');
        case "8":
            return require('./assets/badgePerso/badgePerso8.png');
        case "9":
            return require('./assets/badgePerso/badgePerso9.png');
    }
}