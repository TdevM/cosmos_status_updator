
const {main} = require('./main')

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    
    if (myTimer.IsPastDue)
    {
        context.log('JavaScript is running late!');
    }
    main().then((item) => {
        console.log('Function ran');
    }).catch((error) => {
        console.error(error);
    });
   
    context.log('JavaScript timer trigger function ran!', timeStamp);   
};
