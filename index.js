import { tweetsData as originalTweets } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
let tweetsData = [...originalTweets];

if(localStorage.getItem("tweets")){
    tweetsData= JSON.parse(localStorage.getItem("tweets")) 
     console.log(tweetsData)
}
/*
Challenge:
3. We could improve index.js by moving one line
   of code to a better position. Find it and move it!
*/
document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.delete){
        deleteATweet(e?.target?.dataset?.delete)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
})
function deleteATweet(tweetId){  
    const index = tweetsData.findIndex(eachTweet=> eachTweet.uuid === tweetId);   
    if(index !== -1){
         tweetsData.splice(index,1)
    }
    localStorage.setItem("tweets",JSON.stringify(tweetsData));
    render()
}
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked   
      localStorage.setItem("tweets",JSON.stringify(tweetsData));
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted   
      localStorage.setItem("tweets",JSON.stringify(tweetsData));
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

/*
Challenge:
1. No empty tweets!
2. Clear the textarea after tweeting!
*/
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@ghani`,
            profilePic: `images/tcruise.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })  
      localStorage.setItem("tweets",JSON.stringify(tweetsData))
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    tweetsData.forEach(function(tweet){
        let likeIconClass = ''
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        let retweetIconClass = ''
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        let repliesHtml = ''
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                 <span class="tweet-detail">
                    <i class="fa-solid deletIcon fa-trash"  data-delete="${tweet.uuid}"></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

