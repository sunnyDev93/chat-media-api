import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import Price, {IPrice} from '../models/price';
import mongoose from 'mongoose';


const createPlan = async (req : Request, res : Response) => {
    console.log(req.body);

    const plan = req.body ?. plan;
    const planPrice = req.body ?. planPrice;
    const subs_price = req.body ?. subsPlanPrice;
    const creditPrice = req.body ?. creditPrice;

    try {
        const price = new Price({plan: plan, price: planPrice, creditPrice: creditPrice, subs_price: subs_price})
        await price.save();
        return res.status(StatusCodes.OK).json({message: "Price is created successfully", price: price});
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}
const updatePlanPrice = async (req : Request, res : Response) => { // console.log(req.body);
    const prices = req.body ?. prices;

    if (prices) {

        try {
            for (let i = 0; i < prices.length; i++) {
                const orgPlan = await Price.findOne({_id: prices[i]._id});


                if (orgPlan) {
                    console.log(orgPlan);

                    orgPlan.plan = prices[i] ?. plan
                    orgPlan.price = prices[i] ?. price
                    orgPlan.creditPrice = prices[i] ?. creditPrice
                    orgPlan.subs_price = prices[i] ?. subs_price
                    await orgPlan.save();
                }
            }
            const newPrices = await Price.find();
            if (newPrices) {
                return res.status(StatusCodes.OK).json({message: "Price is updated successfully", newPrices: newPrices});
            }

        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
        }
    }
}
const deletePlan = async (req : Request, res : Response) => {
    const plan = req.body ?. plan; // Assuming you pass the item ID in the URL

    try { // const item = await Price.findById(plan);
        const item = await Price.findOneAndDelete({plan: plan});
        res.status(StatusCodes.OK).json({message: "Delete Success"});

        if (! item) {
            return res.status(404).json({message: 'Item not found'});
        }

        return res.status(204).end(); // 204 No Content to indicate a successful deletion
    } catch (error) {
        return res.status(500).json({error: 'An error occurred while deleting the item'});
    }
};

const fetchPrices = async (req : Request, res : Response) => {
    try {
        const prices = await Price.find();
        res.json({prices: prices});
    } catch (error) {
        res.status(500).json({error: 'An error occurred while fetching users'});
    }
}

const priceController = {
    updatePlanPrice,
    fetchPrices,
    deletePlan,
    createPlan
}

export default priceController;
