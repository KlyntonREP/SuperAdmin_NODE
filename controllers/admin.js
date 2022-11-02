const bcrypt = require('bcrypt');

const admin = require('../model/admin');
const teacher = require('../model/teacher');
const Class = require('../model/class');
const studentModel = require('../model/student');
const approveBlockModel = require('../model/approveBlock');
const approveUnblockModel = require('../model/approveUnblock');

exports.addAdmin = async (req, res) => {
    try{
        const password = await bcrypt.hash(req.body.password, 10);
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({
                message: 'Passwords Do Not Match'
            })
        }
        const Admin = new admin({
            username: req.body.username,
            password: password
        })
        await Admin.save();
        return res.status(200).json({
            message: 'User created Successfully',
            result: Admin
        })
    }catch(err){
        res.status(400).json({
            message: 'Error Adding Admin',
            err: err
        })
    }
};

exports.adminLogin = async (req, res) => {
    try{
        const user = await admin.findOne({username: req.body.username});
        if(user){
            const match = await bcrypt.compare(req.body.password, user.password);
            // const token = jwt.sign({user: user}, process.env.JWT_SECRET, { expiresIn: '1h' });
            if(match){
                password = undefined;
                return res.status(200).json({
                    message: 'Admin Found',
                    result: user,
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
    }catch(error){
        console.log(error);
        res.status(400).json({
            message: 'Error Logging In',
            Error: error
        });
    }
};

exports.addTeacher = async (req, res) => {
    try{
        const password = await bcrypt.hash(req.body.password, 10);
        const teacherEmail = await teacher.findOne({email: req.body.email});
        // const teacherClass = teacher.findOne({teacherClass: req.body.teacherClass});

        if(teacherEmail){
            return res.status(400).json({
                message: 'Email Already In Use'
            });
        }
        if(req.body.password !== req.body.confirmPassword){
            return res.status(400).json({
                message: 'Passwords Do Not Match'
            });
        }
        const AddTeacher = new teacher({
            teacherName: req.body.teacherName,
            teacherClass: req.body.teacherClass,
            email: req.body.email,
            password: password
        });
        AddTeacher.save()
        return res.status(200).json({
            message: 'Teacher Added Successfully',
            result: AddTeacher
        })
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: 'Error Adding Teacher',
            Error: err
        });
    }
};

exports.assignTeacher = async (req, res) => {
    const {id: teacherId} = req.params
    // console.log("teachersId = " + teacherId)
    try{
        const checkTeacher = await teacher.findById(teacherId)
        console.log(checkTeacher)
        if(!checkTeacher){
            return res.status(400).json({
                message: 'No Teacher With This Id'
            });
        }else{
            const checkTeacherClass = await Class.findOne({teacherID: teacherId});
            if(checkTeacherClass){
                return res.status(400).json({
                    message: 'This Teacher Has Been Assigned A Class'
                }); 
            }else{
                const checkClass = await Class.findOne({class: req.body.class});
                if(checkClass){
                    return res.status(400).json({
                        message: 'This Class Has Been Assigned A Teaher'
                    }); 
                }else{
                    // console.log("i am here")
                    const AssignClass = new Class({
                        teacherID: teacherId,
                        class: req.body.class
                    })
                    checkTeacher.teacherClass = req.body.class;
                    checkTeacher.save()
                    await AssignClass.save()
                    return res.status(200).json({
                        message: 'Teacher Assigned Successfully',
                        result: AssignClass
                    })
                }
            }
        }
    }catch(err){
        console.log(err);
        if(err.name === "CastError"){
            return res.status(400).json({
                msg: 'Invalid Teacher Id',
            }); 
        }
        return res.status(400).json({
            msg: 'Error Assigning Teacher To Class',
        });
    }
}

exports.unassignClass = async (req, res) => {
    const {id: teacherId} = req.params;
    try{
       const teacherCheckFirst = await teacher.findById(teacherId);
    //    console.log(teacherCheckFirst)
        if(!teacherCheckFirst){
            return res.status(400).json({
                msg: 'Cant Find Teacher No Teacher With This Id'
            })
        }
        else{
            const hasClassOne = await Class.findOne({teacherID: teacherId})
            if(!hasClassOne){
                return res.status(400).json({
                    msg: 'No Class Was Assigned To This Teacher'
                })
            }
            const teacherCheckSecond = req.body.teacherId;
            const teacherDetails = await teacher.findById(teacherCheckSecond);
            if(!teacherDetails){
                return res.status(400).json({
                    msg: 'Cant Add Teacher No Teacher With This Id'
                })
            }else{
                const checkClass = await Class.findOne({teacherID: teacherCheckSecond})
                if(checkClass){
                    return res.status(400).json({
                        msg: 'This Teacher Is Already Assigned To A Class'
                    })
                }else{
                    hasClassOne.teacherID = teacherCheckSecond
                    const teacherClass = teacherCheckFirst.teacherClass
                    teacherCheckFirst.teacherClass = ""
                    teacherDetails.teacherClass = teacherClass
                    await hasClassOne.save()
                    await teacherCheckFirst.save()
                    await teacherDetails.save()
                    return res.status(200).json({
                        msg: 'Teacher Unassigned And Re-Assigned Successfully'
                    })
                }
            }
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            message: 'Error Unassigning Class',
            Error: err
        });
    }
}

exports.fetchTeachers = async (req, res) => {
    try{
        const teacherDetails = await teacher.find();
        res.status(200).json({
            message: 'Teachers Details Fetched Successfully',
            result: teacherDetails
        })
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: 'Error Fetching Teacher Details',
            Error: err
        });
    }
};

exports.blockTeacher = async(req, res) => {
    const {id: teacherId} = req.params
    try{
        const checkTeacher = await teacher.findById(teacherId)
        if(!checkTeacher){
            return res.status(400).json({
                msg: 'No Teacher With This ID'
            })
        }else{
            const checkBlocked = await teacher.findOne({isBlocked: true})
            if(checkBlocked){
                return res.status(400).json({
                    msg: 'This Teacher Is Blocked Already'
                })
            }else{
                checkTeacher.isBlocked = true
                await checkTeacher.save()
                return res.status(200).json({
                    msg: 'Teacher Has Been Blocked'
                })
            }
        }
    }catch(err){
        res.status(400).json({
            message: 'Error Blocking Teacher',
            Error: err
        });
    }
}

exports.unblockTeacher = async (req, res) => {
    const {id: teacherId} = req.params
    try{
        const checkTeacher = await teacher.findById(teacherId)
        if(!checkTeacher){
            return res.status(400).json({
                msg: 'No Teacher With This ID'
            })
        }else{
            const checkBlocked = await teacher.findOne({isBlocked: false})
            if(checkBlocked){
                return res.status(400).json({
                    msg: 'This Teacher Is Not Blocked'
                })
            }else{
                checkTeacher.isBlocked = false
                await checkTeacher.save()
                return res.status(200).json({
                    msg: 'Teacher Has Been Unblocked'
                })
            }
        }
    }catch(err){
        res.status(400).json({
            message: 'Error Blocking Teacher',
            Error: err
        });
    }
}

exports.removeTeacher = async (req, res) => {
    const {id: teacherId} = req.params
    try{
        const checkTeacher = await teacher.findById(teacherId)
        if(!checkTeacher){
            return res.status(400).json({
                msg: 'No Teacher With This Id'
            })
        }else{
            const removeTeacher = await teacher.findByIdAndRemove(teacherId)
            // await removeTeacher.save()
            return res.status(200).json({
                msg: 'Teacher Successfully Removed'
            })
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            msg: 'Error Removing Teacher'
        })
    }
}

// exports.fetchStudents = async (req, res) => {
//     try{
//         const studentDetails = await student.find();
//         res.status(200).json({
//             message: 'Students Details Fetched Successfully',
//             result: studentDetails
//         })
//     }catch(err){
//         console.log(err);
//         res.status(400).json({
//             message: 'Error Fetching Students Details',
//             Error: err
//         });
//     }
// };

exports.fetchBlockReq = async (req, res) => {
    try{
        const getDetails = await approveBlockModel.find()
        res.status(200).json({
            msg: 'Block Requests Fetched Successfully',
            result: getDetails
        })
    }catch(err){
        console.log(err)
        res.status(400).json({
            msg: 'Error Fetching Block Requests'
        })
    }
}

exports.fetchUnblockReq = async (req, res) => {
    try{
        const getDetails = await approveUnblockModel.find()
        res.status(200).json({
            msg: 'Unblock Requests Fetched Successfully',
            result: getDetails
        })
    }catch(err){
        console.log(err)
        res.status(400).json({
            msg: 'Error Fetching Unblock Requests'
        })
    }
}

exports.approveBlockReq = async (req, res) => {
    const {id: studentId} = req.params
    try{
        const checkStudent = await studentModel.findById(studentId)
        if(!checkStudent){
            return res.status(400).json({
                msg: 'No Student With This Id'
            })
        }else{
            const checkBlocked = await studentModel.findOne({isBlocked: true})
            // console.log(checkBlocked)
            if(checkBlocked){
                return res.status(400).json({
                    msg: 'This Student Is Blocked Already'
                })
            }else{
                checkStudent.isBlocked = true
                await checkStudent.save()
                return res.status(200).json({
                    msg: 'Student Blocked Successfully'
                })
            }
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            msg: 'Error Approving Block Request'
        })
    }
}

exports.approveUnblockReq = async (req, res) => {
    const {id: studentId} = req.params
    try{
        const checkStudent = await studentModel.findById(studentId)
        if(!checkStudent){
            return res.status(400).json({
                msg: 'No Student With This Id'
            })
        }else{
            const checkBlocked = await studentModel.findOne({isBlocked: true})
            // console.log(checkBlocked)
            if(!checkBlocked){
                return res.status(400).json({
                    msg: 'This Student Is Not Blocked'
                })
            }else{
                checkStudent.isBlocked = false
                await checkStudent.save()
                return res.status(200).json({
                    msg: 'Student Unblocked Successfully'
                })
            }
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            msg: 'Error Approving Unblock Request'
        })
    }
}