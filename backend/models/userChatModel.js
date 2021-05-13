import mongoose from 'mongoose'
const userMessageSchema = mongoose.Schema(
    {
        srcUser:{
            type: mongoose.Schema.Types.ObjectId,
            ref:  'User',
            required: true,
        },
        destUser:{
            type: mongoose.Schema.Types.ObjectId,
            ref:  'User',
            required: true,
        },
        msgContent:{
            type: String,
            require: true,
        },
        msgTime:{
            type: mongoose.Schema.Types.Date,
            require:true
        }
    },
)

const userChatSchema = mongoose.Schema(
    {
        buyerId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },

        unread:{
            type:Boolean,
            required: true
        },

        sellerId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },

        productId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },

        messages:{
            type: [userMessageSchema],
            required: true,
        },
    },
    {
        timestamps: true,
    }
)


const UserChat = mongoose.model('UserChat', userChatSchema);
//const UserMessage = mongoose.model('UserMessage', userMessageSchema);

//const Product = mongoose.model('Product', productSchema)
export default UserChat
