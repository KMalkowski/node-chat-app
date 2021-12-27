const socket = io()

//Elements
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

//options
const {username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})

socket.on('message', (message)=>{
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mma')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message)=>{
    console.log('location received: ', location)
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        location: message.url,
        createdAt: moment(message.createdAt).format('h:mma')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

document.querySelector('#sendMessage').addEventListener('click', ()=>{
    socket.emit('sendMessage', document.querySelector('#message').value, (error)=>{
        if(error){
            return console.log(error)
        }
        console.log('message was delivered!')
    })
})

document.querySelector('#sendLocation').addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('geolocation is not supported!')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', [position.coords.latitude, position.coords.longitude], ()=>{
            console.log('location shared!')
        })

    })
})

socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})