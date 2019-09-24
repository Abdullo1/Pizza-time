const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter('f3ac8b70ce3debf340ecf3c1153a8712');
const { WebClient } = require('@slack/web-api');
const token = "xoxb-758051014711-756302103573-pJy7zOEUeRbwW6NIF3cQHAgC";
const port = process.env.PORT || 3000;





//Объявлиям нашего бота и канал на который бот будет отправлять запросы
const web = new WebClient(token);
var channel = "general";






//Переменные которые отвечают за базу данных для заказов
var MongoClient=require("mongodb").MongoClient;
var url='mongodb://localhost:27017/client';
var nameDb='Pizzas';






//Тут пременные для обработки заказа. 
var order=false;
var textM;
var re = /\s*,\s*/;
var pizza={
  Name:"name of pizza",
  size:"size",
  adress:"adress"
}





//Обработка событий 
slackEvents.on('message', (event) => {
  if (event.type !== "message") {
    return;
}
if(event.user!=undefined){
  handleMessage(event.text);
}
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});





// На случае ошибок
slackEvents.on('error', console.error);




// Запуск сервера для бота
slackEvents.start(port).then(() => {
  console.log(`server listening on port ${port}`);
  Send('Привет! Вы готовы сделать заказ (Да/Нет)?')
 
});


function AddDb(){
//Запускаем Базу Данных
MongoClient.connect(url,function(err, DateB){
  if(err){
    return console.log(err);
  }else{
    console.log('MongoDb successfully connected');
  }
   const db=DateB.db(nameDb);






    //Добавляем заказ
    pizza.Name=textM[0];
    pizza.size=textM[1];
    pizza.adress=textM[2];

    db.collection('Users').insertOne(pizza, function(err,result){
    if(err){
      console.log(err);
      return;
    }
    console.log(result.ops);
  })





   //Закрываем Базу Данных.
   DateB.close();
});
}



// Функция для отправки собшений
function Send(answer) {
  web.chat.postMessage({ channel, text:answer })
}




//функция для ответной реакций
function handleMessage(message) {
  if((message=="Да")||(message== "да")) 
  {
    if(order==false)
    {
      Send('Отлично! Это сделать довольно просто.' +'\n'+"Просто укажите:"+'\n'+ '1)Называние пиццы,'+'\n'+' 2)Размер пиццы'+'\n'+' 3)Адресс доставки.'+'\n'+"Укажите все данные через запятую пожалуйста!"+'\n'+'Если хотите отменить заказ, то просто напишите: Отмена.');
      order=true;
    }
    else {
      Send('Ваш заказ принят на обработку, если хотите ещё заказать, то просто напишите: Хочу пиццу!');
      AddDb();
      order=false;
    }
  }
  else if((message== "Нет")||(message== "нет")||(message=="отмена")||(message=="Отмена"))
  {
    if((order==false)||(message=="отмена")||(message=="Отмена"))
    {
     Send('Жаль! Если вы передумаете, скажите просто: Хочу пиццу!');
     order=false;
    }
    else{
     Send('Укажите данные с начало пожалуйста!') 
    }
  }
  else if ((message=='Хочу пиццу!')||(message=='хочу пиццу!'))
  {
      Send('Отлично! Это сделать довольно просто.' +'\n'+"Просто укажите:"+'\n'+ '1)Называние пиццы,'+'\n'+' 2)Размер пиццы'+'\n'+' 3)Адресс доставки.'+'\n'+'Укажите все данные через запятую пожалуйста!'+'\n'+'Если хотите отменить заказ, то просто напишите: Отмена.');
      order=true;
  }
  else if(order==true){
    textM=message.split(re);
    Send(' Ваш заказ:'+'\n'+'1) Имя пиццы:'+textM[0]+'\n'+'2) Размер пиццы:'+textM[1]+'\n'+'3) Адрес доставки:'+textM[2]+'\n'+'Всё правильно?'+'\n'+'Если хотите отменить заказ, то просто напишите: Отмена.')
  }
}
