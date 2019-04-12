# Documentation
## Purpose
This site is a site allowing users to make and enter contests. The purpose of this site is to allow Premium users
to make contests in a simple way and have all users able to view current contests. All users can enter contests. The owner of the 
contest can then select winners, which allows them to get in contact with the winner through email.

## Profit model
This site is profitable by having two types of accounts. Basic members can create accounts for free. These members have access to all 
features except creating their own contests. This means they can enter contests and change their mascots. A Basic member can upgrade 
to Premium by paying $5. This then allows them to also create contests. 

## Templating Language 
I used handlebars as the templating language. I also used React for some more dynamic interfacing. 

## MVC
### Handlebars
I used handlebars for the error message image. 

### React
I used react to create all of the different contests, entries, and account information. 

## Mongo
I used MongoDB to store account, contest, and entry information. 

### Account
Accounts store the user's username, password, email, account type (Basic or Premium) and chosen mascot.  

### Contest
Contests store the name of the contest, owner, description, reward amount in dollars, deadline as a Date, number of entries, 
winner if one has been chosen, and the mascot of the person who created the contest at the time of its creation.

### Entry
Entries store the name of the entry, owner, content as a String, and the creator's mascot at the time of the entry's creation.


## Above and Beyond
I went above and beyond by using React. I also used another npm module to allow me to email people on account information change, 
and contest win. 


# Resources
Below are links to the various images I used as mascots for the website. 

https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiXs56ejLThAhXETd8KHYbiBmsQjRx6BAgBEAU&url=https%3A%2F%2Fwww.teepublic.com%2Fkids-long-sleeve-t-shirt%2F3821775-a-chibi-cat-cute&psig=AOvVaw1AZnOIaC78TtepbnEEuthw&ust=1554386796845761 


https://stickershop.line-scdn.net/stickershop/v1/product/1235641/LINEStorePC/main.png;compress=true

https://cdn130.picsart.com/240333569031212.png?c256x256

http://www.pngonly.com/wp-content/uploads/2017/06/Chibi-PNG.png

https://cdn130.picsart.com/267539347020211.png?r1024x1024

https://i.pinimg.com/originals/eb/22/af/eb22af20dc843cdb35006d989fc68f91.png

https://i.pinimg.com/originals/ab/0e/32/ab0e32d101a30596f6d578ef9b2ddcfc.png

https://cdn.shopify.com/s/files/1/0035/2780/2947/products/Aqua_Chibi.png?v=1548374431

https://sitejerk.com/images/chibi-anime-transparent-18.png

https://t4.rbxcdn.com/0f10ff82ef435b5d2efdc4326c35025c

http://www.clipartroo.com/images/2/dancing-cat-clipart-2371.png

https://cdn140.picsart.com/250793225015212.png?r1024x1024

https://i.pinimg.com/originals/16/dc/4a/16dc4acec69db0475f914d321c41baa8.png

https://i.pinimg.com/originals/db/07/60/db0760264565fd102cae21e30f2c6b8c.png

https://i.pinimg.com/originals/fb/05/05/fb0505597648eb91aac727c90d1278f6.png

https://image.spreadshirtmedia.com/image-server/v1/mp/designs/1017113915,width=178,height=178,version=-1805842648/dog-pomerania-chibi.png

https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/8af292a3-55d6-4688-9e80-a1171eccd347/d8rkjhl-74e3a7d9-c40a-4b48-ac09-765f9b85293c.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzhhZjI5MmEzLTU1ZDYtNDY4OC05ZTgwLWExMTcxZWNjZDM0N1wvZDhya2pobC03NGUzYTdkOS1jNDBhLTRiNDgtYWMwOS03NjVmOWI4NTI5M2MucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.DkuJxfMFdSje3KBFWrHObGGCsswmSSwtz9k5SKF7w0U

http://clipart-library.com/images/8ixno4AbT.png
