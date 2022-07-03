const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { protect } = require("./Middleware/Auth.js");

require("./Model/LiabilitiesModel");
const Liability = mongoose.model("Liability");


router.get('/test', (req, res) => {
    return res.status(200).json({
        message: 'liability route connected'
    })
})

router.post('/addLiability', async (req, res) => {

    const { categoryName } = req.body
    const catExist = await Liability.findOne({ categoryName });
    console.log(categoryName, 'checking?', catExist)
    if (catExist) {
        return res.status(400).json({
            header: {
                message: "Category already exist with this Name",
                code: 1,
            },
        });
    }

    const newCategory = new Liability({
        categoryName: req.body.categoryName,
        fields: req.body.fields,
        // [{
        //     // car loan, bank loan etc.
        //     categoryName: { type: String },

        //     fields: [{
        //         fieldName: {
        //             type: String,
        //         },
        //         value: {
        //             type: Number,
        //         }

        //     }],
        // }],
    });

    if (newCategory) {
        await newCategory.save()
            .then(
                () => {
                    console.log("Category added")
                    res.status(200).json({
                        header: {
                            message: "Category Created",
                            code: 0,
                        },
                        data: {
                            newCategory,
                        },
                    });
                }
            ).catch((err) =>
                res.status(400).json({
                    header: {
                        message: "Category cannot be saved",
                        err,
                        code: 1,
                    },
                }));
    } else {
        return res.status(400).json({
            header: {
                message: "Category is invalid",
                code: 1,
            },
        });
    }
})

router.delete('/deleteLiability/:id', async (req, res) => {
    await Liability.findOneAndDelete({ _id: req.params.id })
        .then((asset) =>
            res.status(200).json({
                header: { message: "Liability Deleted", code: 0 },
                data: asset,
            })
        ).catch((err) =>
            res.status(400).json({
                header: {
                    message: "Unable to find and delete Liability with given id",
                    err,
                    code: 1,
                },
            })
        );
})

router.get('/liabilityCategory/:id', async (req, res) => {

    try {
        const catExist = await Liability.findById(req.params.id)

        if (catExist)
            return res.status(200).json({
                header: { message: "Liability Retrieved", code: 0 },
                data: catExist,
            })
        else
            return res.status(400).json({
                header: { message: "Liability not found", code: 1 },
            })
    } catch (error) {
        return res.status(400).json({
            header: { message: "Liability not found", code: 1 },
            data: catExist,
            error,
        })
    }
})


router.get('/allLiability', async (req, res) => {

    try {
        const catList = await Liability.find({})

        if (catList)
            return res.status(200).json({
                header: { message: "Liability List Retrieved", code: 0 },
                data: catList,
            })
        else
            return res.status(400).json({
                header: { message: "Liabilitys not found", code: 1 },
            })
    } catch (error) {
        return res.status(400).json({
            header: { message: "Liabilitys not found", code: 1 },
            data: catList,
            error,
        })
    }
})

router.put('/updateLiability', async (req, res) => {

    const { _id } = req.body
    const catName = req.body.categoryName
    const catExist = await Liability.findById(_id);
    // console.log(catName, 'checking Update', catExist)

    if (!catExist) {
        return res.status(400).json({
            header: {
                message: "Category doesn't exist with this Name",
                code: 1,
            },
        });
    } else {

        if (req.body.categoryName) {
            const cat2 = await Liability.findOne({ categoryName: catName });
            console.log(catName, 'wut', cat2)
            if (!cat2 || (cat2.categoryName === catExist.categoryName)) {
                // console.log(' updating category Name', cat2 ? cat2.categoryName : 'no cat with this name')
                catExist.categoryName = req.body.categoryName || catExist.categoryName;
            }
            // else console.log(catExist.categoryName, ' names dont match or no cat found with name', cat2.categoryName)
            else {
                // console.log(' here')
                return res.status(400).json({
                    header: {
                        message: "Cannot change Category Name a category already exists with this Name",
                        code: 1,
                    },
                });
            }
        }

        catExist.fields = req.body.fields || catExist.fields;


        try {
            const updaedLiability = await catExist.save();
            console.log('updated Liability is saved')

            res.status(200).json({
                header: {
                    message: "Category updated successfully",
                    code: 0,
                    updaedLiability,
                },
            })
        } catch (error) {
            res.status(400).json({
                header: {
                    message: "Category cannot be saved",
                    error,
                    code: 1,
                },
            })
        }
    }
})

module.exports = router;