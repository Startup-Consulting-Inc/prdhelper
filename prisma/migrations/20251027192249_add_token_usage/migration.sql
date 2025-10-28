-- CreateTable
CREATE TABLE "token_usage" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT,
    "operation" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "tokens_used" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "token_usage_user_id_idx" ON "token_usage"("user_id");

-- CreateIndex
CREATE INDEX "token_usage_project_id_idx" ON "token_usage"("project_id");

-- CreateIndex
CREATE INDEX "token_usage_operation_idx" ON "token_usage"("operation");

-- CreateIndex
CREATE INDEX "token_usage_created_at_idx" ON "token_usage"("created_at");

-- AddForeignKey
ALTER TABLE "token_usage" ADD CONSTRAINT "token_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_usage" ADD CONSTRAINT "token_usage_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
