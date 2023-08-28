import { PlansController } from './subscription.controller';
import { PlansService } from './subscription.service';

describe('PlansController', () => {
  let plansController: PlansController;
  let plansService: PlansService;

  beforeEach(() => {
    plansService = {
      getAvailablePlans: jest.fn(),
      billUser: jest.fn(),
      createSubscription: jest.fn(),
    } as any;

    plansController = new PlansController(plansService);
  });

  describe('getPlans', () => {
    it('should retrieve plans', async () => {
      const mockResponse = [
        {
          id: '1',
          name: 'Basic Plan',
          description: 'Standard features with limited usage',
          price: 9.99,
          subscription_tier: 'Basic',
          usage_limits: {
            storage: { limit: 500, overageRate: 0.1 },
            api_calls: { limit: 1000, overageRate: 0.05 },
          },
          currency: 'USD',
          payment_frequency: 'Monthly',
        },
      ];

      jest
        .spyOn(plansService, 'getAvailablePlans')
        .mockResolvedValue(mockResponse);

      const responseMock = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await plansController.getPlans(responseMock);

      expect(plansService.getAvailablePlans).toHaveBeenCalled();
      expect(responseMock.json).toHaveBeenCalledWith({
        message: 'Plans retrieved successfully',
        data: mockResponse,
      });
    });
  });

  describe('billUser', () => {
    it('should bill a user', async () => {
      const mockUserData = { userId: 'user123' };

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await plansController.billUser(mockUserData, responseMock);

      expect(plansService.billUser).toHaveBeenCalledWith(mockUserData.userId);
      expect(responseMock.json).toHaveBeenCalledWith({
        message: 'User billed successfully',
        data: null,
      });
    });
  });

  // describe('createSubscription', () => {
  //   it('should create a subscription', async () => {
  //     const mockPlanIdValidation = { planId: 1 };
  //     const mockUser = { id: 'user123', email: 'user@example.com' };
  //     const mockResponse = { subscriptionId: 'sub123' };

  //     const requestMock = {
  //       user: mockUser,
  //     };
  //     const responseMock = {
  //       json: jest.fn(),
  //       json: jest.fn(),
  //     };

  //     jest
  //       .spyOn(plansService, 'createSubscription')
  //       .mockResolvedValue(mockResponse);

  //     await plansController.createSubscription(
  //       mockPlanIdValidation,
  //       requestMock,
  //       responseMock,
  //     );

  //     expect(plansService.createSubscription).toHaveBeenCalledWith(
  //       mockPlanIdValidation.planId,
  //       mockUser,
  //     );
  //     expect(responseMock.json).toHaveBeenCalledWith({
  //       message: 'Plan created successfully',
  //       data: mockResponse,
  //     });
  //   });
  // });
});
