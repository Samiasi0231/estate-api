import prisma from "../lib/prisma.js"


export const getChats =async (req,res)=>{
  const tokenUserId =req.userId
    try{
const chats = await  prisma.chat.findMany({
where:{ userIDs:{hasSome:[tokenUserId]}
},

})
res.status(200).json(chats)
    }catch(err){
        console.log(err)
        res.status(500).json({messsage:"failed to get chats!"})
    }
}

export const getChat = async (req, res) => {
    const tokenUserId = req.userId

    try {
     const chat = await prisma.chat.findUnique({
        where:{
            id: req.params.id,
            userIDs:{
                hasSome:[tokenUserId]
            }
        },
        include:{
            message:{
                orderBy:{
                    createdAt: "asc"
                },
            }
        }
     })  
await prisma.chat.update({
    where:{
        id:req.params.id
    },
    data:{
        seenBy:{
            set:[tokenUserId]
        }
    }
})

for (const chat of chat ) {
    const recieverId =chat.userIDs.find ((id)=> id !== tokenUserId)
    const reciever = await prisma.user.findUnique({
        where:{id:recieverId,
        },
        select:{
            id: true,
            username: true,
            avatar:true
        }
    })
    chat.reciever = reciever
}
        res.status(200).json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get user!" });
    }
};




export const addChat =async (req,res)=>{
 const tokenUserId = req.userId

    try{
        const newChat = await prisma.chat.create({
            data:{
                userIDs:[
                    tokenUserId,req.body.recieverId
                ]
            }
        })
res.status(200).json(newChat)
    }catch(err){
        console.log(err)
        res.status(500).json({messsage:"failed to update user!"})
    }
}



export const readChat = async (req, res) => {
    const tokenUserId = req.userId;  // User making the request
    const chatId = req.params.id;  // Chat ID from URL parameter

    try {
        const chat = await prisma.chat.update({
            where: {
                id: chatId,
                userIDs: {
                    hasSome: [tokenUserId] // Ensure user is part of the chat
                }
            },
            data: {
                seenBy: {
                    push: tokenUserId  // Add user to 'seenBy' array without replacing others
                }
            }
        });

        res.status(200).json({ message: "Chat marked as read", chat });
    } catch (err) {
        console.error("Error updating chat:", err);
        res.status(500).json({ message: "Failed to update chat status" });
    }
};
