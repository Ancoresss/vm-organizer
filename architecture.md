# Architecture

When the user adds a new VM, all instances from SpotInst are fetched and stored in the "instances.json". Everything from the "instances.json" is removing and storing again with new/deleted instances.

Коли ми получимо респонз з інстанціями в попап, потрібно респонз записати в обєкт, і в тій самій функції "addVm()" зробити пост реквест на запис цього обєкту у файл через nodejs

Треба спочатку потягнути ВСІ ВМки, з того файлу на основі тегу взяти ГРУП АЙДІ, а на основі груп АЙДІ дізнатися статус ВМки