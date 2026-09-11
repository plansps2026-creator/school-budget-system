import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { BudgetService } from '../src/budget/budget.service';

describe('BudgetService security and ledger', () => {
  const prisma: any = {
    budgetPocket: { findUnique: jest.fn() },
    budgetTransaction: { findMany: jest.fn(), create: jest.fn() },
    auditLog: { create: jest.fn() },
    $transaction: jest.fn(async (fn: any) =>
      fn({
        budgetPocket: { findUnique: prisma.budgetPocket.findUnique },
        budgetTransaction: {
          findMany: prisma.budgetTransaction.findMany,
          create: prisma.budgetTransaction.create,
        },
        auditLog: { create: prisma.auditLog.create },
      }),
    ),
  };

  beforeEach(() => jest.clearAllMocks());

  it('denies a school user from another school', async () => {
    prisma.budgetPocket.findUnique.mockResolvedValue({
      id: 'p1',
      budgetPool: { schoolId: 'school-b' },
    });

    const service = new BudgetService(prisma);

    await expect(
      service.balance(
        { id: 'u', organizationId: 'o', schoolId: 'school-a', roles: [] },
        'p1',
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('prevents insufficient deductions', async () => {
    prisma.budgetPocket.findUnique.mockResolvedValue({
      id: 'p1',
      budgetPool: { schoolId: 'school-a' },
    });
    prisma.budgetTransaction.findMany.mockResolvedValue([
      { type: 'OPENING', amount: 100 },
    ]);

    const service = new BudgetService(prisma);

    await expect(
      service.post(
        { id: 'u', organizationId: 'o', schoolId: 'school-a', roles: [] },
        { budgetPocketId: 'p1', type: 'EXPENSE', amount: 101 } as any,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.budgetTransaction.create).not.toHaveBeenCalled();
  });

  it('allows a deduction within the available ledger balance', async () => {
    prisma.budgetPocket.findUnique.mockResolvedValue({
      id: 'p1',
      budgetPool: { schoolId: 'school-a' },
    });
    prisma.budgetTransaction.findMany.mockResolvedValue([
      { type: 'OPENING', amount: 100 },
    ]);
    prisma.budgetTransaction.create.mockResolvedValue({
      id: 'tx1',
      type: 'EXPENSE',
      amount: 40,
    });

    const service = new BudgetService(prisma);

    await expect(
      service.post(
        { id: 'u', organizationId: 'o', schoolId: 'school-a', roles: [] },
        { budgetPocketId: 'p1', type: 'EXPENSE', amount: 40 } as any,
      ),
    ).resolves.toEqual(expect.objectContaining({ id: 'tx1' }));

    expect(prisma.budgetTransaction.create).toHaveBeenCalled();
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });
});
