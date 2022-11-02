const bcrypt = require('bcrypt');

const studentModel = require('../model/student')
const teacherModel = require('../model/teacher')
const classModel = require('../model/class')
const complaintModel = require('../model/complaints')
const postModel = require('../model/post')


exports.studentLogin = async (req, res) => {
    try{
        const student = await studentModel.findOne({username: req.body.email});
        if(student){
            const match = await bcrypt.compare(req.body.password, student.password);
            // const token = jwt.sign({user: user}, process.env.JWT_SECRET, { expiresIn: '1h' });
            if(match){
                password = undefined;
                return res.status(200).json({
                    message: 'Student Found',
                    result: student,
                    // token: token
                });
            }else{
                return res.status(400).json({
                    message: 'Incorrect Username/Password'
                });
            }
        }else{
            return res.status(400).json({
                message: 'Incorrect Username/Password'
            });
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            msg: 'Error Logging Student In'
        })
    }
}

exports.viewClassmates = async (req, res) => {
    const {id: studentId} = req.params
    try{
        const checkStudent = await studentModel.findById(studentId)
        if(!checkStudent){
            return res.status(400).json({
                message: 'No Student With This Id'
            });
        }else{
            const checkClass = await classModel.findOne({class: checkStudent.class})
            if(!checkClass){
                return res.status(400).json({
                    message: 'This Student Does Not Belong To A Class'
                });
            }else{
                const fetchStudent = await classModel.findOne({class: checkStudent.class})
                // console.log(fetchStudent)
                return res.status(200).json({
                    message: 'Classmates Fetched Successfully',
                    result: fetchStudent
                });
            }
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            msg: 'Error Fetching Classmates'
        })
    }
}

exports.complain = async (req, res) => {
    const {id: studentId} = req.params
    try{
        const checkStudent = await studentModel.findById(studentId)
        if(!checkStudent){
            return res.status(400).json({
                message: 'No Student With This Id'
            });
        }
        const checkTeacher = await teacherModel.findById(req.body.teacherId)
        if(!checkTeacher){
            return res.status(400).json({
                message: 'No Teacher With This Id'
            });
        }else{
            if(checkStudent.class != checkTeacher.teacherClass){
                return res.status(400).json({
                    message: 'This Student Can Not Complain About This Teacher'
                }); 
            }else{
                const Complain = new complaintModel ({
                    studentID: studentId,
                    teacherID: req.body.teacherId,
                    complain: req.body.complain
                })
                Complain.save()
                res.status(200).json({
                    msg: 'Complaint Posted',
                    result: Complain
                })
            }
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            msg: 'Error Posting Complaints' 
        })
    }
}

exports.createPost = async (req, res) => {
    const {id: studentId} = req.params
    try{
        const checkStudent = await studentModel.findById(studentId)
        if(!checkStudent){
            return res.status(400).json({
                message: 'No Student With This Id'
            });
        }else{
            const checkClass = await classModel.findOne({class: checkStudent.class})
            // console.log(checkClass)
            if(!checkClass){
                return res.status(400).json({
                    message: 'This Student Does Not Belong To A Class'
                });
            }else{
                const addPost = new postModel({
                    studentID: studentId,
                    caption: req.body.caption,
                    media: req.body.imageUrl
                });
                checkClass.post.push(addPost)
                checkClass.save()
                addPost.save();
                return res.status(200).json({
                    message: 'Post Created Successfully',
                    result: addPost
                })
            }
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            msg: 'Error Creating Post' 
        })
    }
}

exports.fetchPosts = async (req, res) => {
    const {id: studentId} = req.params
    try{
        const checkStudent = await studentModel.findById(studentId)
        if(!checkStudent){
            return res.status(400).json({
                message: 'No Student With This Id'
            });
        }else{
            const checkClass = await classModel.findOne({class: checkStudent.class})
            if(!checkClass){
                return res.status(400).json({
                    message: 'This Student Does Not Belong To A Class'
                });
            }else{
                const fetchStudent = await classModel.findOne({class: checkStudent.class})
                // console.log(fetchStudent)
                return res.status(200).json({
                    message: 'Posts Fetched Successfully',
                    result: fetchStudent
                });
            }
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            msg: 'Error Fetching Classmates'
        })
    }
}