const Chapter = require("../models/ChapterModel");
const Subject = require("../models/SubjectModel");
const Class = require("../models/ClassModel");
const User = require("../models/UserModel");
const mongoose = require("mongoose");

// Create a new chapter (Admin Only)
exports.createChapter = async (req, res) => {
  try {
    const { chapterName, subjectName, subjectClassName, status, questions } =
      req.body;

    // Validate subject & class
    const subject = await Subject.findById(subjectName);
    const classData = await Class.findById(subjectClassName);

    if (!subject || !classData) {
      return res.status(404).json({ msg: "Subject or Class not found" });
    }

    const chapter = new Chapter({
      chapterName,
      subjectName,
      subjectClassName,
      status: status ?? true,
      questions: questions || [],
    });

    await chapter.save();
    res.status(201).json({ msg: "Chapter created successfully", chapter });
  } catch (error) {
    console.error("Error creating chapter:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// get all chapters with pagination and filtering
exports.getChapters = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { className, chapterName, subjectId } = req.query;

    const pipeline = [];

    // Search by chapter name
    if (chapterName) {
      pipeline.push({
        $match: {
          chapterName: { $regex: chapterName, $options: "i" },
        },
      });
    }

    // Lookup subjectName
    pipeline.push({
      $lookup: {
        from: "subjects", // MongoDB collection name
        localField: "subjectName",
        foreignField: "_id",
        as: "subjectName",
      },
    });

    pipeline.push({ $unwind: "$subjectName" });

    // Filter by subjectId only if it's valid
    if (subjectId) {
      if (mongoose.Types.ObjectId.isValid(subjectId)) {
        pipeline.push({
          $match: {
            "subjectName._id": new mongoose.Types.ObjectId(subjectId),
          },
        });
      } else {
        return res.status(400).json({ msg: "Invalid subjectId format" });
      }
    }

    // Lookup subjectClassName
    pipeline.push({
      $lookup: {
        from: "classes", // MongoDB collection name
        localField: "subjectClassName",
        foreignField: "_id",
        as: "subjectClassName",
      },
    });

    pipeline.push({ $unwind: "$subjectClassName" });

    // Filter by class name
    if (className) {
      pipeline.push({
        $match: {
          "subjectClassName.className": { $regex: className, $options: "i" },
        },
      });
    }

    // Count total after filters
    const totalPipeline = [...pipeline, { $count: "total" }];
    const totalResult = await Chapter.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    // Add pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Get paginated results
    const chapters = await Chapter.aggregate(pipeline);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      chapters,
    });
  } catch (error) {
    console.error("getChapters error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAllChapters = async (req, res) => {
  try {
    const chapters = await Chapter.aggregate([
      {
        $lookup: {
          from: "subjects",
          localField: "subjectName",
          foreignField: "_id",
          as: "subjectName",
        },
      },
      { $unwind: "$subjectName" },
      {
        $lookup: {
          from: "classes",
          localField: "subjectClassName",
          foreignField: "_id",
          as: "subjectClassName",
        },
      },
      { $unwind: "$subjectClassName" },
      {
        $project: {
          _id: 1,
          chapterName: 1,
          subjectName: 1, // includes all subject fields
          subjectClassName: { className: "$subjectClassName.className" }, // only className
        },
      },
    ]);

    res.json(chapters);
  } catch (error) {
    console.error("getAllChapters error:", error);
    res.status(500).json({ message: "Failed to get chapters" });
  }
};

// get a single chapter with unique id

exports.getChapterById = async (req, res) => {
  try {
    const { id } = req.params;

    const chapter = await Chapter.findById(id)
      .populate("subjectName", "subjectName")
      .populate("subjectClassName", "className");

    if (!chapter) {
      return res.status(404).json({ msg: "Chapter not found" });
    }

    res.json(chapter);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update a chapter (Admin Only)
exports.updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedChapter = await Chapter.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedChapter)
      return res.status(404).json({ msg: "Chapter not found" });

    res.json({ msg: "Chapter updated successfully", updatedChapter });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete a chapter (Admin Only)
exports.deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChapter = await Chapter.findByIdAndDelete(id);

    if (!deletedChapter)
      return res.status(404).json({ msg: "Chapter not found" });

    res.json({ msg: "Chapter deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Add a question to a chapter (Admin Only)
exports.addQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      questionName,
      option1,
      option2,
      option3,
      option4,
      boardExamList,
      schoolExamInfo,
      explanation,
      correctAnswer,
      searchType,
      questionLevel,
      topic,
    } = req.body;

    const chapter = await Chapter.findById(id);
    if (!chapter) return res.status(404).json({ msg: "Chapter not found" });

    const newQuestion = {
      type,
      questionName,
      boardExamList,
      schoolExamInfo,
      explanation,
      correctAnswer,
      searchType,
      questionLevel,
      topic,
    };
    if (type === "MCQ") {
      newQuestion.option1 = option1;
      newQuestion.option2 = option2;
      newQuestion.option3 = option3;
      newQuestion.option4 = option4;
    }

    chapter.questions.push(newQuestion);
    await chapter.save();

    res.json({ msg: "MCQ question added successfully", chapter });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
};

exports.addShortQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      questionName,
      boardExamList,
      schoolExamInfo,
      explanation,
      correctAnswer,
      searchType,
      questionLevel,
      topic,
      shortQusDetails,
    } = req.body;

    // ✅ Find the chapter
    const chapter = await Chapter.findById(id);
    if (!chapter) {
      return res.status(404).json({ msg: "Chapter not found" });
    }

    // ✅ Create Short Question object
    const newQuestion = {
      type: "short",
      questionName,
      boardExamList,
      schoolExamInfo,
      explanation,
      correctAnswer,
      searchType,
      questionLevel,
      topic,
      shortQusDetails: {
        shortQuestion: shortQusDetails.shortQuestion,
        shortQuestionAnswer: shortQusDetails.shortQuestionAnswer,
        boardExamList: shortQusDetails.boardExamList,
        shortQuestionTopic: shortQusDetails.shortQuestionTopic,
      },
    };

    chapter.questions.push(newQuestion);
    await chapter.save();

    res.json({ msg: "Short Question added successfully", chapter });
  } catch (error) {
    console.error("Error in addShortQuestion:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.addCQQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      questionName,
      cqDetails,
      boardExamList,
      schoolExamInfo,
      explanation,
      correctAnswer,
      searchType,
      questionLevel,
      topic,
    } = req.body;

    const chapter = await Chapter.findById(id);
    if (!chapter) return res.status(404).json({ msg: "Chapter not found" });

    const newQuestion = {
      type: "CQ",
      questionName,
      boardExamList,
      schoolExamInfo,
      explanation,
      correctAnswer,
      searchType,
      questionLevel,
      topic,
      cqDetails: {
        mainQuestion: cqDetails.mainQuestion,
        question1: cqDetails.question1,
        answer1: cqDetails.answer1,
        question2: cqDetails.question2,
        answer2: cqDetails.answer2,
        question3: cqDetails.question3,
        answer3: cqDetails.answer3,
        question4: cqDetails.question4,
        answer4: cqDetails.answer4,
        topic: cqDetails.topic,
      },
    };

    chapter.questions.push(newQuestion);
    await chapter.save();

    res.json({ msg: "CQ question added successfully", chapter });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
};

exports.getAQuestion = async (req, res) => {
  try {
    const { chapterId, questionId } = req.params;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ msg: "Chapter not found" });
    }

    const questionsArray = Array.isArray(chapter.questions)
      ? chapter.questions
      : [];

    const question = questionsArray.find(
      (q) => q?._id?.toString() === questionId
    );

    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    res.json({ msg: "Question fetched successfully", question });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { chapterId, questionId } = req.params;
    const updateData = req.body;

    // 1. Find the chapter
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) return res.status(404).json({ msg: "Chapter not found" });

    // 2. Find the question inside chapter
    const question = chapter.questions.id(questionId);
    if (!question) return res.status(404).json({ msg: "Question not found" });

    // 3. Update question fields safely
    for (const key of Object.keys(updateData)) {
      if (key === "cqDetails" && typeof updateData.cqDetails === "object") {
        // Merge nested cqDetails fields
        for (const cqKey of Object.keys(updateData.cqDetails)) {
          question.cqDetails[cqKey] = updateData.cqDetails[cqKey];
        }
      } else if (
        key === "shortQusDetails" &&
        typeof updateData.shortQusDetails === "object"
      ) {
        // Merge nested shortQusDetails fields
        for (const shortKey of Object.keys(updateData.shortQusDetails)) {
          question.shortQusDetails[shortKey] =
            updateData.shortQusDetails[shortKey];
        }
      } else if (question.schema.paths[key]) {
        // Update normal fields (topic, questionName, boardExamList, etc.)
        question[key] = updateData[key];
      }
    }

    // 4. Save the updated chapter
    await chapter.save();

    res.json({
      msg: "Question updated successfully",
      updatedQuestion: question,
    });
  } catch (error) {
    console.error("Update Question Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Delete a question from a chapter (Admin Only)
exports.deleteQuestion = async (req, res) => {
  try {
    const { chapterId, questionId } = req.params;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) return res.status(404).json({ msg: "Chapter not found" });

    // Convert to array if it's not
    const questionsArray = Array.isArray(chapter.questions)
      ? chapter.questions
      : [];

    chapter.questions = questionsArray.filter(
      (q) => q?._id?.toString() !== questionId
    );

    await chapter.save();
    res.json({ msg: "Question deleted successfully", chapter });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get questions based on filters

exports.getChaptersById = async (req, res) => {
  try {
    const { ids, email } = req.query;

    // Input validation
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!ids) {
      return res.status(400).json({ message: "Chapter IDs required" });
    }

    // Parallel execution of user lookup and chapter processing
    const [user, chapterIds] = await Promise.all([
      User.findOne({ email }).select("_id").lean(),
      Promise.resolve(ids.split(",")),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate ObjectId format to prevent unnecessary database queries
    const validChapterIds = chapterIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validChapterIds.length === 0) {
      return res.status(400).json({ message: "No valid chapter IDs provided" });
    }

    // Use lean() for better performance and select only needed fields
    const chapters = await Chapter.find({
      _id: { $in: validChapterIds },
    })
      .select("chapterName questions topic") // Select only necessary fields
      .lean();

    if (!chapters.length) {
      return res.status(404).json({ message: "No chapters found" });
    }

    res.status(200).json({
      success: true,
      count: chapters.length,
      chapters,
    });
  } catch (error) {
    console.error("Error in getChaptersById:", error);
    res.status(500).json({
      message: "Server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};
