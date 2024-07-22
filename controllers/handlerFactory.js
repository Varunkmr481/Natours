const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {

    // To allow for nested Get reviews on tour
    let filter ={};
    if(req.params.tourId) filter = {tour : req.params.tourId};

    //EXECUTE QUERY
    // console.log(query);
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;
    // console.log(tours);

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedTime: req.requestedTime,
      results: doc.length,
      data: {
        doc,
      },
    });
  });


exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    // const doc = await Model.findById(req.params.id).populate('reviews');

    if (!doc) {
      return next(new AppError('The Document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });


exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('This Doc was not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: null,
    });
  });


exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No Document found with the ID provided!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });


exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
