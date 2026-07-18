import {db} from "../libs/db.js"
import { pollBatchResults } from "../libs/judge0.lib.js";


export const createProblem = async (req, res) => {
    const {title , description ,difficulty , tags , examples , constraints , testcases , codeSnippet , referenceSolution } = req.body;
    const { userId } = req.user;

    if(req.user.role != "ADMIN"){
        return res.status(403).json({error: "You are not allowed to create a problem"})
    }

    try {
        for(const [language , solutionCode] of Object.entries(referenceSolutions)){
            const language = getJudge0LanguageId(language);

           if(!languageId){
            return res.status(400).json({error: `Language $(language) is not supported`});
           } 

           const submission = testcases.map(({input , output})=>({
              source_code:solutionCode,
              language_id:languageId,
              stdin:input,
              expected_output:output,

           }))

           const submissionResults = await submitBatch(submissions)

           const token = submissionResults.map((res)=>res.token);

           const results = await pollBatchResults(tokens);

           for(let i=0; i<results.length; i++){
              const result = results[i];

              if(result.status.id !== 3){
                return res.status(400).json({error: `Testcase ${i+1} failed for language ${language}`})
              }
           }

           const newProblem = await db.problem.create({
            data:{
                title , description ,difficulty , tags , examples , constraints , testcases , codeSnippet , referenceSolution , userId:req.user.id,

            }
           });

           return res.status(201).json(newProblem);
        }
    } catch (error) {
        
    }

}

export const getAllProblems = async (req, res) => {}

export const getAllProblemById = async (req, res) => {}

export const updateProblem = async (req, res) => {}

export const deleteProblem = async (req, res) => {}

export const getAllProblemsSlovedByUser = async (req, res) => {}