
const Rooms = require('../models/room_finder');
const asyncHandler = require("../middleware/async");


exports.getAllRooms = asyncHandler(async (req, res) => {
    try {
        const room = await Rooms.find();
        res.json({ data: room });
    }
    catch (error) {
        console.log(error);
    }
});
exports.createARoom = (req, res, next) => {

    const newRoom = {
        ...req.body,
        user: req.user.id
    }

    console.log(newRoom)


    Rooms.create(newRoom)
        .then(room => res.status(201).json(room))
        .catch(next)


}

// exports.deleteAllRoom = (req, res) => {
//     Rooms.deleteMany()
//         .then(() => res.status(201).json({ "message": "Deleted all successfully" }))
//         .catch(next);
// }

exports.getRoomById = (req, res, next) => {
    Rooms.findById(req.params.room_id)
        .then(room => {
            if (!room) {
                res.status(404).json({ error: "Room Not Found" })
            }
            res.json({data: room});
        })
        .catch(next);
}

exports.getAllMyRooms = (req, res, next) => {
    Rooms.find({user: req.user.id})
    .then(rooms => {
        if(!rooms){
            res.status(404).json({error: "You haven't added any rooms"})
        }
        res.json({data: rooms})
    })
    .catch(next);

}
exports.updateRoom = (req, res, next) => {
    Rooms.findByIdAndUpdate(
        req.params.room_id,
        { $set: req.body },
        { new: true }
    )
        .then(updatedRoom => res.status(200).json(updatedRoom))
        .catch(next)
}

exports.deleteRoomById = async(req, res, next) => {
    await Rooms.findByIdAndDelete(req.params.room_id).then((room) => {
        if (!room) {
          return res
            .status(404)
            .json({ message: "Room not found with id of ${req.params.id}" });
        }
        res.status(200).json({data: room });
      });
    };



exports.uploadImage = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    Rooms.findById(postId)
        .then(room => {
            console.log(room);
            if (!req.file) {
                return res.status(400).send({ message: "Please upload a file" });
            }
            const imageName = req.file.filename
            Rooms.findByIdAndUpdate(
                postId,
                { $set: { image: imageName } },
                { new: true }
            )
                .then(success => {
                    res.status(200).json({
                        success: true,
                        data: req.file.filename,
                    });
                })
                .catch(error => res.status(500).json({ error: error.message }))

        })
        .catch(error => res.send({ error: error.message }))

});

