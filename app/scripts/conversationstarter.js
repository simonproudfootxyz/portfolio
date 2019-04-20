var conversationStarter = {
    subredditUrls: [
        'https://www.reddit.com/r/AskReddit/top.json?sort=top&t=mont&limit=100', 
        'https://www.reddit.com/r/AskReddit/top.json?sort=top&t=all&limit=100'
    ],
    threads: [],
    replies: [],
    mappingService : {
        mapJsonToThreads: function(data) {
            let allThreads = data.map(threadList => {
                return threadList.data.children.map(item => {
                    return item.data;
                });
            });
            allThreads.forEach(threads => threads.forEach(thread => 
                conversationStarter.threads.push(thread))
            );
        },
        mapJsonToReplies: function(data) {
            conversationStarter.replies = [];
            var repliesSet = data.filter(set => set.data.children[0].kind !== 't3');
            var replies = repliesSet.map(set => set.data.children)[0];
            conversationStarter.replies = replies;
        },
        fetchRandomThread: function(){
            var randomIndex = Math.floor(Math.random() * (conversationStarter.threads.length - 1));
            conversationStarter.replies = [];
            return conversationStarter.threads[randomIndex];
        }
    },
    restService: {
        fetchThreads: function(urls){
            Promise.all(urls.map(url =>
                fetch(url).then(resp => resp.json())
            )).then(json => {
                conversationStarter.mappingService.mapJsonToThreads(json);
            })
        },
        fetchReplies: function(url) {
            fetch(`${url}.json`)
                .then(resp => resp.json())
                .then(data => conversationStarter.mappingService.mapJsonToReplies(data));
        }
    },
    renderingService: {
        renderComponentInSelector: function(component, selector) {
            document.querySelector(selector).innerHTML = component;
        },
        createRepliesElement: function(replies) {
            let elements = replies.map(reply => {
                let info = reply.data;
                return `<li class="reply">${info.author}: ${info.body}</li>`
            }).join('');
            return elements;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    conversationStarter.restService.fetchThreads(conversationStarter.subredditUrls);
})