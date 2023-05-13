const mongoose = require("mongoose");
const counsellingFormSchema = new mongoose.Schema(
    {
        fName : String,
        lName : String,
        email : String,
        gender : String,
        phone : String,
        address: String,
        jeeMainPerc: String,
        jeeMainCRLRank: String,
        jeeMainCatRank: String,
        jeeAdvCRLRank: String,
        jeeAdvCatRank: String,
        homeState: String,
        jeeAppNo: String,
        jeeMainRankCard:
        {
            data: Buffer,
            contentType: String
        },
        jeeAdvRankCard:
        {
            data: Buffer,
            contentType: String
        }
    },
    {
        collection: "counsellingFormDetails"
    },
    {
        timestamps: true
    }
)

mongoose.model("counsellingFormDetails",counsellingFormSchema);