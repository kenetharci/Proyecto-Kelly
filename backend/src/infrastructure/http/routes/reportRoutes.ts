import { Router } from "express"
import { CreateReportUseCase } from "../../../application/usecases/reports/CreateReportUseCase"
import { GetReportsUseCase } from "../../../application/usecases/reports/GetReportsUseCase"
import { UpdateReportUseCase } from "../../../application/usecases/reports/UpdateReportUseCase"
import { DeleteReportUseCase } from "../../../application/usecases/reports/DeleteReportUseCase"
import { PostgresReportRepository } from "../../repositories/PostgresReportRepository"
import { authMiddleware, adminMiddleware, type AuthRequest } from "../middleware/authMiddleware"

const router = Router()
const reportRepository = new PostgresReportRepository()
const createReportUseCase = new CreateReportUseCase(reportRepository)
const getReportsUseCase = new GetReportsUseCase(reportRepository)
const updateReportUseCase = new UpdateReportUseCase(reportRepository)
const deleteReportUseCase = new DeleteReportUseCase(reportRepository)

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const report = await createReportUseCase.execute({
      ...req.body,
      userId: req.user!.userId,
    })
    res.status(201).json(report)
  } catch (error) {
    console.error("Error creating report:", error)
    res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" })
  }
})

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status } = req.query
    const filters: any = {}

    if (req.user!.role === "user") {
      filters.userId = req.user!.userId
    }

    if (status) {
      filters.status = status
    }

    const reports = await getReportsUseCase.execute(filters)
    res.json(reports)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const report = await reportRepository.findById(req.params.id)

    if (!report) {
      return res.status(404).json({ error: "Report not found" })
    }

    res.json(report)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const report = await updateReportUseCase.execute(req.params.id, req.body)

    if (!report) {
      return res.status(404).json({ error: "Report not found" })
    }

    res.json(report)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const success = await deleteReportUseCase.execute(req.params.id)

    if (!success) {
      return res.status(404).json({ error: "Report not found" })
    }

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
