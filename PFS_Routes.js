const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { protect } = require("./Middleware/Auth.js");

require("./Model/PFS_Model");
const PFS = mongoose.model("PFS");


router.get('/test', (req, res) => {

    return res.status(200).json({
        message: 'Personal Finance System (PFS) route connected'
    })
})

router.post('/addPfs', async (req, res) => {

    const { _id } = req.body
    const { questions } = req.body
    const pfsExist = await PFS.findById(_id);
    console.log(questions, 'checking pfs', pfsExist)
    if (pfsExist) {
        return res.status(400).json({
            header: {
                message: "Question already exist with this Name",
                code: 1,
            },
        });
    }

    const newPFS = new PFS({
        questions: req.body.questions,
        // fields: req.body.fields,
    });

    if (newPFS) {
        await newPFS.save()
            .then(
                () => {
                    console.log("Question added")
                    res.status(200).json({
                        header: {
                            message: "Question Created",
                            code: 0,
                        },
                        data: {
                            newPFS,
                        },
                    });
                }
            ).catch((err) =>
                res.status(400).json({
                    header: {
                        message: "Question cannot be saved",
                        err,
                        code: 1,
                    },
                }));
    } else {
        return res.status(400).json({
            header: {
                message: "Question is invalid",
                code: 1,
            },
        });
    }
})

router.get('/allPfs', async (req, res) => {

    try {
        const pfsList = await PFS.find({})

        if (pfsList)
            return res.status(200).json({
                header: { message: "PFS List Retrieved", code: 0 },
                data: pfsList,
            })
        else
            return res.status(400).json({
                header: { message: "PFS not found", code: 1 },
            })
    } catch (error) {
        return res.status(400).json({
            header: { message: "PFS not found", code: 1 },
            data: pfsList,
            error,
        })
    }
})


module.exports = router;