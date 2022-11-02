const bcrypt = require('bcrypt');

const studentModel = require('../model/student')
const teacherModel = require('../model/teacher')
const classModel = require('../model/class')
const postModel = require('../model/post')
const approveBlockedModel = require('../model/approveBlock')
const approveUnblockedModel = require('../model/approveUnblock')
const testScoresModel = require('../model/testScores')
const examScoresModel = require('../model/examScores')

exports.createStudent = async (req, res) => {
    const {id:teacherId} = req.params
    const email = await studentModel.findOne({email: req.body.email})
    const password = await bcrypt.hash(req.body.password, 10)
    try{
        if(email){
            return res.status(400).json({
                msg: 'Email Already In Use'
            })
        }
        if(req.body.password != req.body.confirmPassword){
            return res.status(400).json({
                msg: 'Passwords Do Not Match'
            })
        }
        const checkTeacher = await teacherModel.findById(teacherId)
        if(!checkTeacher){
            return res.status(400).json({
                msg: 'No Teacher With This Id'
            })
        }else{
            const addStudent = new studentModel({
                fullname: req.body.fullname,
                email: req.body.email,
                password: password
            })
            addStudent.save()
            return res.status(200).json({
                msg: 'Student Created Successfully'
            })
        }
    }catch(err){
        console.log(err)
        return res.status(400).json({
            msg: 'Error Adding Student'
        })
    }
}

exports.addStudentToClass = async (req, res) => {
    const {id: teacherId} = req.params
    try{
        const checkTeacher = await teacherModel.findById(teacherId);
        // console.log("This is the teacher details" + checkTeacher)
        if(!checkTeacher){
            return res.status(400).json({
                msg: 'No Teacher With This ID'
            }) 
        }else{
            const hasClass = await classModel.findOne({teacherID: teacherId})
            if(!hasClass){
                return res.status(400).json({
                    msg: 'This Teacher Does Not Have A Class'
                }) 
            }
            const studentId = await studentModel.findById(req.body.studentId)
            const checkClass = await classModel.findOne({students: studentId})
            if(checkClass){
                return res.status(400).json({
                    msg: 'This Student Already Belongs To A Class'
                }) 
            }else{
                const teacherClass = checkTeacher.teacherClass
                studentId.class = teacherClass
                hasClass.students.push(studentId)
                await hasClass.save()
                await studentId.save()
                return res.status(200).json({
                    msg: 'Student Added To Class Successfully'
                })
            }
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            message: 'Error Adding Student To Class',
            Error: err
        });
    }
}

exports.removeStudentFromClass = async (req, res) => {
    const {id: teacherId} = req.params
    try{
        const checkTeacher = await teacherModel.findById(teacherId);
        // console.log("This is the teacher details" + checkTeacher)
        if(!checkTeacher){
            return res.status(400).json({
                msg: 'No Teacher With This ID'
            }) 
        }else{
            const hasClass = await classModel.findOne({teacherID: teacherId})
            if(!hasClass){
                return res.status(400).json({
                    msg: 'This Teacher Does Not Have A Class'
                }) 
            }
            const studentId = await studentModel.findById(req.body.studentId)
            // console.log(studentId)
            const checkClass = await classModel.findOne({students: studentId})
            if(!checkClass){
                return res.status(400).json({
                    msg: 'This Student Does Not Belongs To A Class'
                }) 
            }
            if(checkTeacher.teacherClass != studentId.class){
                return res.status(400).json({
                    msg: 'This Teacher Can Not Remove This Student'
                }) 
            }else{                
                studentId.class = ""
                checkClass.students.pull(studentId)
                await checkClass.save()
                await studentId.save()
                res.status(200).json({
                    msg: 'Student Successfully Removed From Class'
                })
            }
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            message: 'Error Removing Student From Class',
            Error: err
        })
    }
}

exports.blockStudent = async (req, res) => {
    const {id: teacherId} = req.params
    try{
        const checkTeacher = await teacherModel.findById(teacherId)
        if(!checkTeacher){
            return res.status(400).json({
                msg: 'No Teacher With This ID'
            })
        }else{
            const checkStudent = await studentModel.findById(req.body.studentId)
            // console.log(checkStudent)
            if(!checkStudent){
                return res.status(400).json({
                    msg: 'No Student With This ID'
                }) 
            }
            const checkBlocked = await studentModel.findOne({isBlocked: true})
            if(checkBlocked){
                return res.status(400).json({
                    msg: 'This Student Is Blocked Already'
                })
            }else{
                if(checkTeacher.teacherClass != checkStudent.class){
                    return res.status(400).json({
                        msg: 'This Teacher Can Not Block This Student.'
                    }) 
                }else{
                   const block = new approveBlockedModel({
                    teacherID: teacherId,
                    studentID: req.body.studentId,
                    reason: req.body.reason
                   });
                   block.save()
                   return res.status(200).json({
                    msg: 'Block Request Sent Successfully'
                   })
                }
            }
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            message: 'Error Blocking Student',
            Error: err
        });
    }
}

exports.unblockStudent = async (req, res) => {
    const {id: teacherId} = req.params
    try{
        const checkTeacher = await teacherModel.findById(teacherId)
        if(!checkTeacher){
            return res.status(400).json({
                msg: 'No Teacher With This ID'
            })
        }else{
            const checkStudent = await studentModel.findById(req.body.studentId)
            console.log(checkStudent)
            if(!checkStudent){
                return res.status(400).json({
                    msg: 'No Student With This ID'
                }) 
            }
            const checkBlocked = await studentModel.findOne({isBlocked: true})
            if(!checkBlocked){
                return res.status(400).json({
                    msg: 'This Student Is Not Blocked'
                })
            }else{
                if(checkTeacher.teacherClass != checkStudent.class){
                    return res.status(400).json({
                        msg: 'This Teacher Can Not Unblock This Student.'
                    }) 
                }else{
                   const unblock = new approveUnblockedModel({
                    teacherID: teacherId,
                    studentID: req.body.studentId,
                    reason: req.body.reason
                   });
                   unblock.save()
                   return res.status(200).json({
                    msg: 'Unblock Request Sent Successfully'
                   })
                }
            }
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            message: 'Error Unblocking Student',
            Error: err
        });
    }
}

exports.fetchStudent = async (req, res) => {
    const {id: teacherId} = req.params
    try{
        const checkTeacher = await teacherModel.findById(teacherId)
        if(!checkTeacher){
            return res.status(400).json({
                message: 'No Teacher With This Id'
            });
        }else{
            const checkClass = await classModel.findOne({teacherID: teacherId})
            if(!checkClass){
                return res.status(400).json({
                    message: 'This Teacher Is Not Assigned To A Class'
                });
            }else{
                const fetchStudent = await classModel.findOne({teacherID: teacherId})
                // console.log(fetchStudent)
                return res.status(200).json({
                    message: 'Students Fetched Successfully',
                    result: fetchStudent
                });
            }
        }
    }catch(err){
        // console.log(err)
        res.status(400).json({
            message: 'Error Fetching Students',
            Error: err
        });
    }
}

exports.approvePost = async (req, res) => {
    const {id: teacherId, postId: postId} = req.params
    try{
        const checkTeacher = await teacherModel.findById(teacherId)
        if(!checkTeacher){
            return res.status(400).json({
                message: 'No Teacher With This Id'
            });
        }
        const checkPost = await postModel.findById(postId)
        // console.log(checkPost)
        if(!checkPost){
            return res.status(400).json({
                message: 'No Post With This Id'
            });
        }else{
            const checkClass = await classModel.findOne({teacherID: teacherId})
            if(!checkClass){
                return res.status(400).json({
                    message: 'This Teacher Is Not Assigned To A Class'
                });
            }
            const student = checkPost.studentID
            const findStudent = await studentModel.findById(student)
            // console.log(findStudent)
            if(checkTeacher.teacherClass != findStudent.class){
                return res.status(400).json({
                    message: 'This Teacher Can Not Approve This Post'
                }); 
            }else{
                const checkPost = await postModel.findOne({studentID: student})
                if(checkPost.isPosted === true){
                    return res.status(400).json({
                        message: 'This Post Has Been Approved Already'
                    }); 
                }else{
                    checkPost.isPosted = true
                    checkClass.post = ({isPosted: true})
                    checkPost.save()
                    return res.status(400).json({
                        message: 'Post Approved Successfully'
                    }); 
                }
            }  
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            message: 'Error Approving Post',
            Error: err
        });
    }
}
exports.addTestScores = async (req, res) => {
    const {teacherId: teacherId, studentId: studentId} = req.params
    try{
        const checkTeacher = await teacherModel.findById(teacherId)
        if(!checkTeacher){
            return res.status(400).json({
                message: 'No Teacher With This Id'
            });
        }
        const checkStudent = await studentModel.findById(studentId)
        if(!checkStudent){
            return res.status(400).json({
                message: 'No Student With This Id'
            });
        }else{
            if(checkTeacher.teacherClass != checkStudent.class){
                return res.status(400).json({
                    message: 'This Teacher Can Not Add Test Scores to This Student'
                });
            }else{
               const addTest = new testScoresModel({
                studentID: studentId,
                subject: req.body.subject,
                score: req.body.score
               })
               checkStudent.testScores.push(addTest)
               checkStudent.save()
               addTest.save()
               res.status(200).json({
                    msg: "Test Scores Added Successfully"
               }) 
            }
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            message: 'Error Adding Test Scores',
            Error: err
        }); 
    }
}

exports.addExamScores = async (req, res) => {
    const {teacherId: teacherId, studentId: studentId} = req.params
    try{
        const checkTeacher = await teacherModel.findById(teacherId)
        if(!checkTeacher){
            return res.status(400).json({
                message: 'No Teacher With This Id'
            });
        }
        const checkStudent = await studentModel.findById(studentId)
        if(!checkStudent){
            return res.status(400).json({
                message: 'No Student With This Id'
            });
        }else{
            if(checkTeacher.teacherClass != checkStudent.class){
                return res.status(400).json({
                    message: 'This Teacher Can Not Add Exam Scores to This Student'
                });
            }else{
               const addExam = new examScoresModel({
                studentID: studentId,
                subject: req.body.subject,
                score: req.body.score
               })
               checkStudent.examScores.push(addExam)
               checkStudent.save()
               addExam.save()
               res.status(200).json({
                    msg: "Exam Scores Added Successfully"
               }) 
            }
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            message: 'Error Adding Exam Scores',
            Error: err
        }); 
    }
}